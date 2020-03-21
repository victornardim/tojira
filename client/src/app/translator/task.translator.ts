import { Task } from '../model/task.interface';
import { SubtaskTranslator } from './subtask.translator';
import { Subtask } from '../model/subtask.interface';
import { WorklogTranslator } from './worklog.translator';
import { Worklog } from '../model/worklog.interface';
import { WorklogStatus } from '../model/worklog-status.enum';

export class TaskTranslator {
    private task: any;

    private subtaskTranslator: SubtaskTranslator;
    private worklogTranslator: WorklogTranslator;

    constructor() {
        this.subtaskTranslator = new SubtaskTranslator();
        this.worklogTranslator = new WorklogTranslator();
    }

    public translate(task: any, timeEntries: any[]): Task {
        this.task = task;

        return {
            id: task.id,
            key: task.key,
            assignee: task.fields.assignee.emailAddress,
            description: this.getDescription(),
            isSubtask: task.fields.issuetype.subtask,
            type: task.fields.issuetype.name,
            subtasks: this.getSubtasks(),
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

    private getSubtasks(): Subtask[] {
        if (!this.task.fields.issuetype.subtask) {
            return this.task.fields.subtasks.map(subtask => {
                return this.subtaskTranslator.translate(subtask);
            });
        }

        return null;
    }

    private getWorklogs(): Worklog[] {
        return this.task.fields.worklog.worklogs.map(worklog => {
            return this.worklogTranslator.translate(worklog);
        });
    }
}
