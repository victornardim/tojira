import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { WorklogComponent } from './worklog.component';
import { HttpClientModule } from '@angular/common/http';

describe('WorklogComponent', () => {
    let component: WorklogComponent;
    let fixture: ComponentFixture<WorklogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                WorklogComponent
            ],
            imports: [
                NgbModule,
                ReactiveFormsModule,
                HttpClientModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WorklogComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should return error for empty start date', () => {
        component.filtersForm.controls.start.markAsTouched();
        component.filtersForm.controls.start.setValue('');
        expect(component.startHaveErrors()).toBeTruthy();
        expect(component.mustShowStartRequiredError()).toBeTruthy();
    });

    it('should return error for absurd start date', () => {
        component.filtersForm.controls.start.markAsTouched();
        component.filtersForm.controls.start.setValue('10000-01-01');
        expect(component.startHaveErrors()).toBeTruthy();
        expect(component.mustShowStartDateIsAbsurdError()).toBeTruthy();
    });

    it('should not return error for filled start date', () => {
        component.filtersForm.controls.start.markAsTouched();
        component.filtersForm.controls.start.setValue('2020-01-01');
        expect(component.startHaveErrors()).toBeFalsy();
        expect(component.mustShowStartRequiredError()).toBeFalsy();
        expect(component.mustShowStartDateIsAbsurdError()).toBeFalsy();
    });

    it('should return error for empty end date', () => {
        component.filtersForm.controls.end.markAsTouched();
        component.filtersForm.controls.end.setValue('');
        expect(component.endHaveErrors()).toBeTruthy();
        expect(component.mustShowEndRequiredError()).toBeTruthy();
    });

    it('should return error for absurd end date', () => {
        component.filtersForm.controls.end.markAsTouched();
        component.filtersForm.controls.end.setValue('10000-01-01');
        expect(component.endHaveErrors()).toBeTruthy();
        expect(component.mustShowEndDateIsAbsurdError()).toBeTruthy();
    });

    it('should not return error for filled end date', () => {
        component.filtersForm.controls.end.markAsTouched();
        component.filtersForm.controls.end.setValue('2020-01-01');
        expect(component.endHaveErrors()).toBeFalsy();
        expect(component.mustShowEndRequiredError()).toBeFalsy();
        expect(component.mustShowEndDateIsAbsurdError()).toBeFalsy();
    });
});
