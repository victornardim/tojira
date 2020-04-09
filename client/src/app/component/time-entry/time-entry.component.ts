import { Component, Input } from '@angular/core';
import { TimeEntry } from 'src/app/model/time-entry.interface';
import { getTimeTemplate } from 'src/app/shared/util/date/date.util';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'tojira-time-entry',
    templateUrl: './time-entry.component.html'
})
export class TimeEntryComponent {
    @Input() timeEntry: TimeEntry;
    @Input() parentGroup: FormArray;

    timeEntryForm: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.timeEntryForm = this.formBuilder.group({
            id: [this.timeEntry.id],
            willSend: [true]
        });

        this.parentGroup.push(this.timeEntryForm);
    }

    public getTimeTemplate(seconds: number): string {
        return getTimeTemplate(seconds);
    }
}