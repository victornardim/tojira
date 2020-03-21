import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from 'src/app/model/task.interface';
import { Subscription } from 'rxjs';
import { doUnsubscribe } from 'src/app/shared/common.subscription';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { dateIsAbsurdValidator } from 'src/app/shared/validators/date-is-absurd.validator';
import { TimeEntriesFacade } from './time-entries.facade';
import { AlertService } from 'src/app/shared/component/alerts/alert.service';

const invalidDateRange: ValidatorFn = (formGroup: FormGroup) => {
    const start = formGroup.controls.start.value;
    const end = formGroup.controls.end.value;

    if (!!start && !!end && new Date(`${end} 00:00:00`) < new Date(`${start} 00:00:00`)) {
        return { invalidDateRange: true };
    }

    return null;
};

@Component({
    selector: 'tojira-time-entries',
    templateUrl: './time-entries.component.html'
})
export class TimeEntriesComponent implements OnInit, OnDestroy {
    constructor(
        private timeEntriesFacade: TimeEntriesFacade,
        private formBuilder: FormBuilder,
        private alertService: AlertService) { }

    filtersForm: FormGroup;
    tasksForm: FormArray;

    tasks: Task[] = [];
    completion = 0;

    tasksSubscription: Subscription;
    completionSubscription: Subscription;

    ngOnInit() {
        this.formInit();
        this.timeEntriesFacade.init();
        this.listenToTaskLoad();
        this.listenToCompletion();

        if (!this.settingsAreSetted()) {
            this.alertService.warning('Some of the required settings isn\'t setted');
        }
    }

    public settingsAreSetted(): boolean {
        return this.timeEntriesFacade.settingsAreSetted();
    }

    ngOnDestroy() {
        doUnsubscribe(this.completionSubscription);
        this.timeEntriesFacade.destroy();
    }

    private formInit() {
        this.filtersFormInit();
        this.tasksFormInit();
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
        this.tasksSubscription = this.timeEntriesFacade.getTasksSubject()
            .subscribe(tasks => {
                this.tasks = tasks;
            });
    }

    private listenToCompletion() {
        this.completionSubscription = this.timeEntriesFacade.getCompletionSubject()
            .subscribe(completion => {
                this.completion = completion;

                if (completion === 100) {
                    doUnsubscribe(this.tasksSubscription);
                }
            });
    }

    public loadTasks() {
        this.clear();

        const start = new Date(`${this.start.value} 00:00:00`);
        const end = new Date(`${this.end.value} 23:59:59`);

        this.timeEntriesFacade
            .loadTasks(start.toISOString(), end.toISOString());
    }

    private clear() {
        this.tasks.splice(0, this.tasks.length);
        this.completion = 0;

        this.tasksFormInit();
    }

    public registerWorklogs() {
        const timeEntriesToRegister = this.getTimeEntriesToRegsiter();

        if (!timeEntriesToRegister.length) {
            this.alertService.warning('Select unless one time entry to register');
            return;
        }

        this.timeEntriesFacade.registerWorklogs(timeEntriesToRegister);
    }

    private getTimeEntriesToRegsiter(): number[] {
        const timeEntriesToRegister = [];

        this.tasksForm.controls.forEach((taskForm: FormGroup) => {
            (taskForm.controls.timeEntries as FormArray).controls.forEach((timeEntryForm: FormGroup) => {
                if (!!timeEntryForm.controls.willSend.value) {
                    timeEntriesToRegister.push(timeEntryForm.controls.id.value);
                }
            });
        });

        return timeEntriesToRegister;
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
}