import { WorklogStatus } from './worklog-status.enum';

export interface WorklogProcess {
    task: string;
    totalWorklog: number;
    processedWorklog: number;
    status: WorklogStatus;
}
