import { TimeEntry } from '../model/time-entry.interface';

export class TimeEntryTranslator {
    timeEntry: any;

    public translate(timeEntry: any): TimeEntry {
        this.timeEntry = timeEntry;

        return {
            id: this.timeEntry.id,
            description: this.timeEntry.description,
            duration: this.timeEntry.duration,
            tag: this.getTag()
        } as TimeEntry;
    }

    private getTag(): string {
        if (!!this.timeEntry.tags) {
            return this.timeEntry.tags[0];
        }

        return '';
    }
}
