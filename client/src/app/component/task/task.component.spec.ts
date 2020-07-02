import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormArray, FormBuilder } from '@angular/forms';
import { TaskComponent } from '../task/task.component';
import { WorklogStatus } from 'src/app/model/worklog-status.enum';
import { getTask } from './task.mock';

describe('TaskComponent', () => {
    let component: TaskComponent;
    let fixture: ComponentFixture<TaskComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TaskComponent
            ],
            imports: [
                NgbModule,
                ReactiveFormsModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskComponent);
        component = fixture.debugElement.componentInstance;

        component.parentGroup = getParentGroup();
        component.task = getTask();
        fixture.detectChanges();
    });

    function getParentGroup(): FormArray {
        const formBuilder = new FormBuilder();
        return formBuilder.array([]);
    }

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should return pause icon when status is pending', () => {
        fixture.detectChanges();
        expect(component.getStatusIcon()).toEqual('fas fa-pause-circle fa-2x');
    });

    it('should return paper airplane icon when status is processing', () => {
        component.task.status = WorklogStatus.PROCESSING;

        fixture.detectChanges();
        expect(component.getStatusIcon()).toEqual('far fa-paper-plane fa-2x');
    });

    it('should return times icon when status is error', () => {
        component.task.status = WorklogStatus.ERROR;

        fixture.detectChanges();
        expect(component.getStatusIcon()).toEqual('fas fa-times-circle fa-2x');
    });

    it('should return check icon when status is done', () => {
        component.task.status = WorklogStatus.DONE;

        fixture.detectChanges();
        expect(component.getStatusIcon()).toEqual('fas fa-check-circle fa-2x');
    });
});
