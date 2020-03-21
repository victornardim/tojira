import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { _ } from 'underscore/underscore';
import { JiraService } from 'src/app/service/jira.service';
import { TogglService } from 'src/app/service/toggl.service';
import { TimeEntry } from 'src/app/model/time-entry.interface';
import { Task } from 'src/app/model/task.interface';
import { TaskTranslator } from 'src/app/translator/task.translator';
import { TimeEntryTranslator } from 'src/app/translator/time-entry.translator';
import { extractTaskKey } from 'src/app/shared/common.extractor';
import { doUnsubscribe, isSubscribed } from 'src/app/shared/common.subscription';
import { SettingsSingleton } from 'src/app/service/settings.singleton';
import { AlertService } from 'src/app/shared/component/alerts/alert.service';
import { WorklogRegistration } from 'src/app/model/worklog-registration.interface';
import { WorklogRegistrationTranslator } from 'src/app/translator/worklog-registration.translator';
import { WorklogProcessService } from './worklog-process.service';
import { TimeEntryOperation } from './time-entry-operation.enum';

@Injectable({
    providedIn: 'root'
})
export class TimeEntriesFacade {
    constructor(
        private jira: JiraService,
        private toggl: TogglService,
        private settings: SettingsSingleton,
        private alertService: AlertService,
        private worklogProcessService: WorklogProcessService) { }

    private timeEntries: TimeEntry[] = [];
    private uniqueTaskKeys: string[] = [];
    private tasks: Task[] = [];

    private taskQuantity = 0;
    private processedTasks = 0;

    private tasksSubject = new Subject<Task[]>();
    private completionSubject = new Subject<number>();

    private taskTranslator = new TaskTranslator();
    private timeEntryTranslator = new TimeEntryTranslator();
    private worklogRegistrationTranslator = new WorklogRegistrationTranslator();

    private timeEntriesSubscription: Subscription;
    private tasksSubscriptions: Subscription[] = [];
    private worklogProcessSubscription: Subscription;

    public init(): void {
        this.listenToWorklogProcess();
    }

    private listenToWorklogProcess(): void {
        this.worklogProcessSubscription = this.worklogProcessService.getSubject()
            .subscribe(processes => {
                processes.forEach(process => {
                    const foundTask = this.tasks.find(task => task.key === process.task);
                    foundTask.status = process.status;
                });

                this.tasksSubject.next(this.tasks);
            });
    }

    public destroy(): void {
        doUnsubscribe(this.worklogProcessSubscription);
        this.worklogProcessSubscription = null;
    }

    public settingsAreSetted(): boolean {
        return !!this.settings.jiraToken &&
            !!this.settings.jiraUser &&
            !!this.settings.jiraPrefix &&
            !!this.settings.togglToken &&
            !!this.settings.jiraTasksAllowedPrefixes;
    }

    public loadTasks(start: string, end: string): void {
        this.timeEntriesSubscription = this.toggl.getTimeEntries(start, end, this.getTogglToken())
            .subscribe((timeEntries: any[]) => {
                if (!timeEntries.length) {
                    this.alertService.warning('No time entries for the period');
                    return;
                }

                this.clear();
                this.getAllTimeEntries(timeEntries);
                this.getUniqueTaskKeys();
                this.resetCompletion(this.uniqueTaskKeys.length);
                this.getAllTasks();
            }, (error) => {
                this.alertService.error(error.message);
            });
    }

    private getTogglToken(): string {
        return btoa(`${this.settings.togglToken}:api_token`);
    }

    private clear(): void {
        this.timeEntries.splice(0, this.timeEntries.length);
        this.uniqueTaskKeys.splice(0, this.uniqueTaskKeys.length);
        this.tasks.splice(0, this.tasks.length);
    }

    private getAllTimeEntries(timeEntries: any[]): void {
        timeEntries.forEach(timeEntry => {
            if (this.isJiraTask(timeEntry)) {
                this.timeEntries.push(this.timeEntryTranslator.translate(timeEntry));
            }
        });
    }

    private isJiraTask(timeEntry: any): boolean {
        return !!extractTaskKey(timeEntry.description, this.getJiraTasksAllowedPrefixes());
    }

    private getJiraTasksAllowedPrefixes(): string[] {
        return this.settings.jiraTasksAllowedPrefixes.split(';');
    }

    private getUniqueTaskKeys(): void {
        this.uniqueTaskKeys = _.unique(
            this.timeEntries.map(timeEntry => extractTaskKey(timeEntry.description, this.getJiraTasksAllowedPrefixes()))
        );
    }

    private resetCompletion(total: number): void {
        this.taskQuantity = total;
        this.processedTasks = 0;
        this.setCompletion(null);
    }

    private getAllTasks(): void {
        this.uniqueTaskKeys.forEach(taskKey => {
            this.getTask(taskKey);
        });
    }

    private getTask(key: string): void {
        const subscription = this.jira.getTask(key, this.getJiraToken())
            .subscribe((task: any) => {
                this.tasks.push(this.taskTranslator.translate(task, this.getTaskTimeEntries(task)));
                this.tasksSubject.next(this.tasks);

                this.doProgress(TimeEntryOperation.LOAD);
            });

        this.tasksSubscriptions.push(subscription);
    }

    private getJiraToken(): string {
        return btoa(`${this.settings.jiraUser}:${this.settings.jiraToken}`);
    }

    private getTaskTimeEntries(task: Task): TimeEntry[] {
        return this.timeEntries.filter(timeEntry => extractTaskKey(timeEntry.description, this.getJiraTasksAllowedPrefixes()) === task.key);
    }

    private doProgress(operation: TimeEntryOperation): void {
        this.processedTasks++;
        this.setCompletion(operation);
    }

    private setCompletion(operation: TimeEntryOperation): void {
        const completion = Math.round(this.processedTasks / (this.taskQuantity / 100));
        this.completionSubject.next(completion);

        if (completion === 100) {
            this.doUnsubscribeAll();
            this.alertService.success(this.getCompletionMessage(operation));
        }
    }

    private doUnsubscribeAll(): void {
        doUnsubscribe(this.timeEntriesSubscription);
        this.timeEntriesSubscription = null;

        this.tasksSubscriptions.forEach(subscription => doUnsubscribe(subscription));
        this.tasksSubscriptions.splice(0, this.tasksSubscriptions.length);
    }

    private getCompletionMessage(operation: TimeEntryOperation): string {
        if (operation === TimeEntryOperation.LOAD) {
            return 'Time entries loaded successfully';
        } else if (operation === TimeEntryOperation.REGISTRATION) {
            return 'Time entries registered successfully';
        }

        return '';
    }

    public registerWorklogs(timeEntriesId: number[]): void {
        this.resetCompletion(timeEntriesId.length);

        const tasksToRegisterWorklog = this.getTasksToRegisterWorklog(timeEntriesId);
        this.worklogProcessService.init(tasksToRegisterWorklog);

        tasksToRegisterWorklog.forEach(taskToRegisterWorklog => {
            taskToRegisterWorklog.task.worklogs.forEach(worklog => {
                if (!worklog.oldId) {
                    this.registerNewWorklog(taskToRegisterWorklog.task.key, worklog);
                } else {
                    this.overwriteExistingWorklog(taskToRegisterWorklog.task.key, worklog);
                }
            });
        });
    }

    private getTasksToRegisterWorklog(timeEntriesId: number[]): WorklogRegistration[] {
        const tasksToRegisterWorklog = [];

        this.tasks.forEach(task => {
            const taskToRegisterWorklog = this.worklogRegistrationTranslator.translate(task, timeEntriesId);
            if (taskToRegisterWorklog.task.worklogs.length) {
                tasksToRegisterWorklog.push(taskToRegisterWorklog);
            }
        });

        return tasksToRegisterWorklog;
    }

    private registerNewWorklog(taskKey: string, worklog: any): void {
        this.jira.registerWorklog(taskKey, worklog, this.getJiraToken())
            .subscribe((worklog) => {
                this.worklogProcessService.doProgress(taskKey);
            }, (error) => {
                this.worklogProcessService.throwError(taskKey);
            }).add(() => {
                this.doProgress(TimeEntryOperation.REGISTRATION);
            });
    }

    private overwriteExistingWorklog(taskKey: string, worklog: any): void {
        this.jira.deleteWorklog(taskKey, worklog.oldId, this.getJiraToken())
            .subscribe(() => {
                this.registerNewWorklog(taskKey, worklog);
            });
    }

    public getTasksSubject(): Subject<Task[]> {
        return this.tasksSubject;
    }

    public getCompletionSubject(): Subject<number> {
        return this.completionSubject;
    }
}
