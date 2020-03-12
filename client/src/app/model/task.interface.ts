import { Worklog } from './worklog.interface';
import { TimeEntry } from './time-entry.interface';
import { Subtask } from './subtask.interface';
import { WorklogStatus } from './worklog-status.enum';

export interface Task {
    id: number;
    key: string;
    description: string;
    assignee: string;
    subtasks: Subtask[];
    isSubtask: boolean;
    type: string;
    worklogs: Worklog[];
    timeEntries: TimeEntry[];
    status: WorklogStatus;
}
