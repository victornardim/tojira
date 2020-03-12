import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert } from './alert.interface';
import { AlertService } from './alert.service';

@Component({
    selector: 'tojira-alerts',
    templateUrl: './alerts.component.html'
})
export class AlertsComponent implements OnInit, OnDestroy {
    alerts: Alert[];
    alertsSubscription: Subscription;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alerts = [];

        this.alertsSubscription = this.alertService
            .getAlertsSubject()
            .subscribe(alerts => this.alerts = alerts);
    }

    ngOnDestroy() {
        if (this.alertsSubscription && !this.alertsSubscription.closed) {
            this.alertsSubscription.unsubscribe();
        }
    }

    close(alert: Alert) {
        this.alerts.splice(this.alerts.indexOf(alert), 1);
    }
}
