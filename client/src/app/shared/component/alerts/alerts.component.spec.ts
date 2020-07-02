import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { AlertsComponent } from './alerts.component';
import { AlertType } from './alert.enum';
import { AlertService } from './alert.service';
import { getAlerts } from './alert.mock';

describe('AlertsComponent', () => {
    let component: AlertsComponent;
    let fixture: ComponentFixture<AlertsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AlertsComponent
            ],
            imports: [
                NgbModule
            ],
            providers: [
                AlertService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlertsComponent);
        component = fixture.debugElement.componentInstance;

        const alertService = TestBed.get(AlertService);
        spyOn(alertService, 'getAlertsSubject').and.returnValue(of(getAlerts()));

        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should close one alert', () => {
        component.close({
            message: 'Simple log message',
            time: new Date('2019-09-28 01:00:00'),
            type: AlertType.INFO
        });
        expect(component.alerts.length).toEqual(1);
    });
});
