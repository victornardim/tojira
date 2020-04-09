import { Worklog } from './worklog.interface';
import { TimeEntry } from './time-entry.interface';
import { WorklogStatus } from './worklog-status.enum';

export interface Task {
    id: number;
    key: string;
    description: string;
    assignee: string;
    type: string;
    worklogs: Worklog[];
    timeEntries: TimeEntry[];
    status: WorklogStatus;
}
