import { TestBed, async } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { AlertsComponent } from './alerts.component';
import { AlertType } from './alert.enum';
import { Alert } from './alert.interface';

describe('AlertsComponent', () => {
    let fixture = null;
    let app = null;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AlertsComponent
            ],
            imports: [
                NgbModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlertsComponent);
        app = fixture.debugElement.componentInstance;

        spyOn(app.logService, 'getLogsSubject').and.returnValue(of(getLogs()));

        app.ngOnInit();
    });

    function getLogs(): Alert[] {
        return [
            {
                message: 'Simple log message',
                time: new Date('2019-09-28 01:00:00'),
                type: AlertType.INFO
            },
            {
                message: 'Error',
                time: new Date('2019-09-28 02:00:00'),
                type: AlertType.DANGER
            }] as Alert[];
    }

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    it('should close one log', () => {
        app.close({
            message: 'Simple log message',
            time: new Date('2019-09-28 01:00:00'),
            type: AlertType.INFO
        });
        expect(app.logs.length).toEqual(1);
    });

    it('should clear all logs when confirm the dialog', () => {
        spyOn(window, 'confirm').and.returnValue(true);

        app = fixture.debugElement.componentInstance;
        app.clearAll();
        expect(app.logs.length).toEqual(0);
    });

    it('should not clear all logs when cancel the dialog', () => {
        spyOn(window, 'confirm').and.returnValue(false);

        app = fixture.debugElement.componentInstance;
        app.clearAll();
        expect(app.logs.length).toEqual(2);
    });
});
