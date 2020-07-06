import { Task } from '../model/task.interface';
import { WorklogTranslator } from './worklog.translator';
import { Worklog } from '../model/worklog.interface';
import { WorklogStatus } from '../model/worklog-status.enum';

export class TaskTranslator {
    private task: any;

    private worklogTranslator: WorklogTranslator;

    constructor() {
        this.worklogTranslator = new WorklogTranslator();
    }

    public translate(task: any, timeEntries: any[]): Task {
        this.task = task;

        return {
            id: task.id,
            key: task.key,
            assignee: task.fields.assignee.emailAddress,
            description: this.getDescription(),
            type: task.fields.issuetype.name,
            worklogs: this.getWorklogs(),
            timeEntries: timeEntries,
            status: WorklogStatus.PENDING
        } as Task;
    }

    private getDescription(): string {
        if (!!this.task.fields.parent) {
            return this.task.fields.parent.fields.summary;
        } else {
            return this.task.fields.summary;
        }
    }

    private getWorklogs(): Worklog[] {
        return this.task.fields.worklog.worklogs.map(worklog => {
            return this.worklogTranslator.translate(worklog);
        });
    }
}
