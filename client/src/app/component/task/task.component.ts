import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/model/task.interface';
import { SettingsSingleton } from 'src/app/service/settings.singleton';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { WorklogStatus } from 'src/app/model/worklog-status.enum';

@Component({
    selector: 'tojira-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
    constructor(
        private formBuilder: FormBuilder,
        private settings: SettingsSingleton) { }

    @Input() task: Task;
    @Input() parentGroup: FormArray;

    public taskForm: FormGroup;

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.taskForm = this.formBuilder.group({
            timeEntries: this.formBuilder.array([])
        });

        this.parentGroup.push(this.taskForm);
    }

    public getStatusIcon(): string {
        switch (this.task.status) {
            case WorklogStatus.PENDING:
                return 'fas fa-pause-circle fa-2x';

            case WorklogStatus.PROCESSING:
                return 'far fa-paper-plane fa-2x';

            case WorklogStatus.ERROR:
                return 'fas fa-times-circle fa-2x';

            case WorklogStatus.DONE:
                return 'fas fa-check-circle fa-2x';
        }
    }

    public get jiraPrefix(): string {
        return this.settings.jiraPrefix;
    }

    public getTimeEntriesForm(): FormArray {
        return (this.taskForm.controls.timeEntries as FormArray);
    }
}