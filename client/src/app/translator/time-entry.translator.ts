import { TimeEntry } from '../model/time-entry.interface';
import { extractTaskComment } from '../shared/util/extractor/extractor.util';

export class TimeEntryTranslator {
    timeEntry: any;

    public translate(timeEntry: any): TimeEntry {
        this.timeEntry = timeEntry;

        return {
            id: this.timeEntry.id,
            description: this.timeEntry.description,
            duration: this.timeEntry.duration,
            tag: this.getTag(),
            comment: this.getComment(),
            at: this.getEntryMoment()
        } as TimeEntry;
    }

    private getTag(): string {
        if (!!this.timeEntry.tags) {
            return this.timeEntry.tags[0];
        }

        return '';
    }

    private getComment(): string {
        return extractTaskComment(this.timeEntry.description);
    }

    private getEntryMoment(): Date {
        const moment = new Date(this.timeEntry.start);
        moment.setMinutes(moment.getMinutes() - moment.getTimezoneOffset());
        return moment;
    }
}
