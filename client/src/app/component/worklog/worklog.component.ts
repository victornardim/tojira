import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from 'src/app/model/task.interface';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { dateIsAbsurdValidator } from 'src/app/shared/validators/date-is-absurd.validator';
import { WorklogFacade } from './worklog.facade';
import { AlertService } from 'src/app/shared/component/alerts/alert.service';
import { getTimeTemplate } from 'src/app/shared/util/date/date.util';
import { doUnsubscribe } from 'src/app/shared/util/subscription/subscription.util';

const invalidDateRange: ValidatorFn = (formGroup: FormGroup) => {
    const start = formGroup.controls.start.value;
    const end = formGroup.controls.end.value;

    if (!!start && !!end && new Date(`${end} 00:00:00`) < new Date(`${start} 00:00:00`)) {
        return { invalidDateRange: true };
    }

    return null;
};

@Component({
    selector: 'tojira-worklog',
    templateUrl: './worklog.component.html'
})
export class WorklogComponent implements OnInit, OnDestroy {
    constructor(
        private worklogFacade: WorklogFacade,
        private formBuilder: FormBuilder,
        private alertService: AlertService) { }

    filtersForm: FormGroup;
    tasksForm: FormArray;

    tasks: Task[] = [];
    completion = 0;
    totalTime = 0;
    done = false;

    tasksSubscription: Subscription;
    completionSubscription: Subscription;
    doneSubscription: Subscription;

    ngOnInit() {
        this.formInit();
        this.worklogFacade.init();
        this.listenToTaskLoad();
        this.listenToCompletion();
        this.listenToRegistrationDone();

        if (!this.settingsAreSetted()) {
            this.alertService.warning('Some of the required settings isn\'t setted');
        }
    }

    private formInit() {
        this.filtersFormInit();
        this.tasksFormInit();
    }

    public settingsAreSetted(): boolean {
        return this.worklogFacade.settingsAreSetted();
    }

    private filtersFormInit() {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const today = now.toISOString().slice(0, 10);

        this.filtersForm = this.formBuilder.group({
            start: [today, [Validators.required, dateIsAbsurdValidator]],
            end: [today, [Validators.required, dateIsAbsurdValidator]]
        }, { validator: invalidDateRange });
    }

    private tasksFormInit() {
        this.tasksForm = this.formBuilder.array([]);
    }

    private listenToTaskLoad() {
        this.tasksSubscription = this.worklogFacade.getTasksSubject()
            .subscribe(tasks => {
                this.tasks = tasks;
                this.calculateTotalTime();
            });
    }

    private calculateTotalTime() {
        this.totalTime = this.tasks.reduce((total, task) => {
            return total += task.timeEntries.reduce((time, entry) => {
                return time += entry.duration;
            }, 0);
        }, 0);
    }

    private listenToCompletion() {
        this.completionSubscription = this.worklogFacade.getCompletionSubject()
            .subscribe(completion => {
                this.completion = completion;
            });
    }

    private listenToRegistrationDone() {
        this.doneSubscription = this.worklogFacade.getDoneSubject()
            .subscribe(done => {
                this.done = done;
            });
    }

    ngOnDestroy() {
        doUnsubscribe(this.completionSubscription);
        doUnsubscribe(this.tasksSubscription);
        doUnsubscribe(this.doneSubscription);

        this.worklogFacade.destroy();
    }

    public loadTasks() {
        this.clear();

        const start = new Date(`${this.start.value} 00:00:00`);
        const end = new Date(`${this.end.value} 23:59:59`);

        this.worklogFacade
            .loadTasks(start.toISOString(), end.toISOString());
    }

    private clear() {
        this.tasks.splice(0, this.tasks.length);
        this.completion = 0;
        this.totalTime = 0;
        this.done = false;

        this.tasksFormInit();
    }

    public registerWorklogs() {
        const selectedTimeEntries = this.getSelectedTimeEntries();

        if (!selectedTimeEntries.length) {
            this.alertService.warning('Select unless one time entry to register');
            return;
        }

        this.worklogFacade.registerWorklogs(selectedTimeEntries);
    }

    private getSelectedTimeEntries(): number[] {
        const selectedTimeEntries = [];

        this.tasksForm.controls.forEach((taskForm: FormGroup) => {
            (taskForm.controls.timeEntries as FormArray).controls.forEach((timeEntryForm: FormGroup) => {
                if (!!timeEntryForm.controls.willSend.value) {
                    selectedTimeEntries.push(timeEntryForm.controls.id.value);
                }
            });
        });

        return selectedTimeEntries;
    }

    public allTasksAreLoaded(): boolean {
        return (this.completion === 100);
    }

    public get start(): AbstractControl {
        return this.filtersForm.controls.start;
    }

    public mustShowStartRequiredError(): boolean {
        return (this.startHaveErrors() && this.start.errors.required);
    }

    public mustShowStartDateInThePastError(): boolean {
        return (this.startHaveErrors() && this.start.errors.dateInThePast);
    }

    public mustShowStartDateIsAbsurdError(): boolean {
        return (this.startHaveErrors() && this.start.errors.dateIsAbsurd);
    }

    public startHaveErrors(): boolean {
        return (this.start.errors && this.start.touched);
    }

    public get end(): AbstractControl {
        return this.filtersForm.controls.end;
    }

    public mustShowEndRequiredError(): boolean {
        return (this.endHaveErrors() && this.end.errors.required);
    }

    public mustShowEndDateInThePastError(): boolean {
        return (this.endHaveErrors() && this.end.errors.dateInThePast);
    }

    public mustShowEndDateIsLesserThanStartDate(): boolean {
        return (this.formHaveErrors() && this.filtersForm.errors.invalidDateRange);
    }

    public mustShowEndDateIsAbsurdError(): boolean {
        return (this.endHaveErrors() && this.end.errors.dateIsAbsurd);
    }

    public endHaveErrors(): boolean {
        return (this.end.errors && this.end.touched);
    }

    public formHaveErrors(): boolean {
        return (!!this.filtersForm.invalid && !!this.filtersForm.errors);
    }

    public getFormattedTotalTime(): string {
        return getTimeTemplate(this.totalTime);
    }

    public shouldDisableRegisterWorklogsButton(): boolean {
        return (!this.allTasksAreLoaded() || !this.settingsAreSetted() || this.done);
    }
}