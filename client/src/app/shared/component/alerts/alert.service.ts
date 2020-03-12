import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Alert } from './alert.interface';
import { AlertType } from './alert.enum';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    alerts: Alert[] = [];
    alertsSubject = new Subject<Alert[]>();

    error(message: string) {
        const alert = {
            message,
            time: new Date(),
            type: AlertType.DANGER
        } as Alert;

        this.alerts.push(alert);
        this.alertsSubject.next(this.alerts);
    }

    success(message: string) {
        const alert = {
            message,
            time: new Date(),
            type: AlertType.SUCCESS
        } as Alert;

        this.alerts.push(alert);
        this.alertsSubject.next(this.alerts);
    }

    getAlertsSubject(): Subject<Alert[]> {
        return this.alertsSubject;
    }
}
