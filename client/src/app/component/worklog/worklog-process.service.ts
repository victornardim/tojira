import { Injectable } from '@angular/core';
import { WorklogRegistration } from 'src/app/model/worklog-registration.interface';
import { WorklogProcess } from 'src/app/model/worklog-process.interface';
import { WorklogStatus } from 'src/app/model/worklog-status.enum';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WorklogProcessService {
    private registrationProcess: WorklogProcess[] = [];

    private subject = new Subject<WorklogProcess[]>();

    public init(tasksToRegisterWorklog: WorklogRegistration[]) {
        this.registrationProcess = tasksToRegisterWorklog.map(taskToRegisterWorklog => {
            return {
                task: taskToRegisterWorklog.task.key,
                status: WorklogStatus.PROCESSING,
                processedWorklog: 0,
                totalWorklog: taskToRegisterWorklog.task.worklogs.length
            } as WorklogProcess;
        });

        this.subject.next(this.registrationProcess);
    }

    public doProgress(task: string) {
        const processFound = this.registrationProcess.find(process => process.task === task);
        if (!!processFound) {
            processFound.processedWorklog++;

            if (processFound.processedWorklog === processFound.totalWorklog) {
                if (processFound.status !== WorklogStatus.ERROR) {
                    processFound.status = WorklogStatus.DONE;
                }
            }
        }

        this.subject.next(this.registrationProcess);
    }

    public throwError(task: string) {
        const processFound = this.registrationProcess.find(process => process.task === task);
        if (!!processFound) {
            processFound.status = WorklogStatus.ERROR;
        }

        this.subject.next(this.registrationProcess);
    }

    public getSubject(): Subject<WorklogProcess[]> {
        return this.subject;
    }
}