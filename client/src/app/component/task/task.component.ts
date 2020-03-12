import { Component, Input, OnInit } from '@angular/core';
import { TimeInSeconds } from 'src/app/shared/time-in-seconds.enum';
import { Task } from 'src/app/model/task.interface';
import { SettingsSingleton } from 'src/app/service/settings.singleton';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

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

        this.task.timeEntries.forEach(timeEntry => {
            (this.taskForm.controls.timeEntries as FormArray).push(this.formBuilder.group({
                id: [timeEntry.id],
                willSend: [true]
            }));
        });

        this.parentGroup.push(this.taskForm);
    }

    public getTimeTemplate(seconds: number): string {
        let days = 0;
        let hours = 0;
        let minutes = 0;

        if (seconds >= TimeInSeconds.DAY) {
            days = Math.floor(seconds / TimeInSeconds.DAY);
            seconds %= TimeInSeconds.DAY;
        }

        if (seconds >= TimeInSeconds.HOUR) {
            hours = Math.floor(seconds / TimeInSeconds.HOUR);
            seconds %= TimeInSeconds.HOUR;
        }

        if (seconds >= TimeInSeconds.MINUTE) {
            minutes = Math.floor(seconds / TimeInSeconds.MINUTE);
            seconds %= TimeInSeconds.MINUTE;
        }

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    public get jiraPrefix(): string {
        return this.settings.jiraPrefix;
    }
}