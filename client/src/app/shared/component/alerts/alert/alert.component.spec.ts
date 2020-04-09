import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormArray, FormBuilder } from '@angular/forms';
import { AlertComponent } from './alert.component';
import { Alert } from '../alert.interface';
import { AlertType } from '../alert.enum';

describe('AlertComponent', () => {
    let component: AlertComponent;
    let fixture: ComponentFixture<AlertComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AlertComponent
            ],
            imports: [
                NgbModule,
                ReactiveFormsModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AlertComponent);
        component = fixture.debugElement.componentInstance;

        component.alert = getAlert();

        spyOn(component.dismiss, 'emit').and.stub();

        fixture.detectChanges();
    });

    function getAlert(): Alert {
        return {
            message: 'Alert message',
            time: new Date(),
            type: AlertType.SUCCESS
        } as Alert;
    }

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should return check icon when type is success', () => {
        fixture.detectChanges();
        expect(component.getTypeIcon()).toEqual('fas fa-check-circle');
    });

    it('should return exclamation icon when type is warning', () => {
        component.alert.type = AlertType.WARNING;

        fixture.detectChanges();
        expect(component.getTypeIcon()).toEqual('fas fa-exclamation-triangle');
    });

    it('should return times icon when type is danger', () => {
        component.alert.type = AlertType.DANGER;

        fixture.detectChanges();
        expect(component.getTypeIcon()).toEqual('fas fa-times-circle');
    });

    it('should return info icon when type is info', () => {
        component.alert.type = AlertType.INFO;

        fixture.detectChanges();
        expect(component.getTypeIcon()).toEqual('fas fa-info-circle');
    });

    it('should dismiss when close is called', () => {
        fixture.detectChanges();

        component.close();
        expect(component.dismiss.emit).toHaveBeenCalled();
    });
    it('should clear timer when mouseIn is called', fakeAsync(() => {
        fixture.detectChanges();

        component.mouseIn();
        expect(component.dismiss.emit).not.toHaveBeenCalled();
        tick(6000);
        expect(component.dismiss.emit).not.toHaveBeenCalled();
    }));

    it('should set timer when mouseOut is called', fakeAsync(() => {
        fixture.detectChanges();

        component.mouseOut();
        expect(component.dismiss.emit).not.toHaveBeenCalled();
        tick(5000);
        expect(component.dismiss.emit).toHaveBeenCalled();
    }));
});
