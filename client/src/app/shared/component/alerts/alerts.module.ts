import { NgModule } from '@angular/core';
import { AlertsComponent } from './alerts.component';
import { AlertComponent } from './alert/alert.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AlertsComponent,
        AlertComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        NgbModule
    ],
    exports: [
        AlertsComponent,
        AlertComponent
    ],
    providers: [],
    bootstrap: []
})
export class AlertsModule { }
