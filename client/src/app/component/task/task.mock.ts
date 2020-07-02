import { Task } from 'src/app/model/task.interface';
import { WorklogStatus } from 'src/app/model/worklog-status.enum';

export function getTask(): Task {
    return {
        id: 1,
        description: 'Test task',
        assignee: 'test@test.com',
        key: 'TASK-123',
        status: WorklogStatus.PENDING,
        timeEntries: [],
        type: 'Task type',
        worklogs: []
    } as Task;
}