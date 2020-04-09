import { WorklogRegistration } from '../model/worklog-registration.interface';
import { Task } from '../model/task.interface';
import { TimeEntry } from '../model/time-entry.interface';
import { getTimeISOStringWithTimezoneOffset } from '../shared/util/date/date.util';

export class WorklogRegistrationTranslator {
    task: Task;
    timeEntriesId: number[];

    public translate(task: Task, timeEntriesId: number[]): WorklogRegistration {
        this.task = task;
        this.timeEntriesId = timeEntriesId;

        return {
            task: this.getTask()
        } as WorklogRegistration;
    }

    private getTask(): any {
        return {
            key: this.task.key,
            worklogs: this.getWorklogs()
        }
    }

    private getWorklogs(): any[] {
        const worklogs = [];

        this.task.timeEntries.forEach(timeEntry => {
            const timeEntryExists = this.timeEntriesId.some(id => timeEntry.id === id);
            if (timeEntryExists) {
                worklogs.push(this.getWorklog(timeEntry, this.getOldId(timeEntry)));
            }
        })

        return worklogs;
    }

    private getOldId(timeEntry: TimeEntry): number {
        const worklogToDelete = this.task.worklogs.find(worklog => worklog.togglId === timeEntry.id.toString());
        let oldId = null;

        if (!!worklogToDelete) {
            oldId = worklogToDelete.id.toString();
        }

        return oldId;
    }

    private getWorklog(timeEntry: TimeEntry, oldId: number): any {
        return {
            timeSpentSeconds: timeEntry.duration,
            oldId,
            comment: this.getComments(timeEntry),
            started: getTimeISOStringWithTimezoneOffset(timeEntry.at)
        };
    }

    private getComments(timeEntry: TimeEntry): any {
        return {
            type: 'doc',
            version: 1,
            content: this.getContent(timeEntry)
        };
    }

    private getContent(timeEntry: TimeEntry): any[] {
        const content = [];

        content.push(this.getComment(`TOGGL_ID:${timeEntry.id}`));

        if (!!timeEntry.comment) {
            content.push(this.getComment(timeEntry.comment));
        }

        return content;
    }

    private getComment(comment: string): any {
        return {
            type: 'paragraph',
            content: [
                {
                    text: comment,
                    type: 'text'
                }
            ]
        }
    }
}