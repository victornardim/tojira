import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './settings.component';
import { SettingsFacade } from './settings.facade';
import { Settings } from 'src/app/model/settings.interface';

describe('SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SettingsComponent
            ],
            imports: [
                NgbModule,
                ReactiveFormsModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.debugElement.componentInstance;

        const settingsFacade = TestBed.get(SettingsFacade);
        spyOn(settingsFacade, 'load').and.returnValue(getSettings());

        fixture.detectChanges();
    });

    function getSettings(): Settings {
        return {
            jiraToken: 'FAKE_JIRA_TOKEN',
            jiraUser: 'FAKE_USER',
            jiraPrefix: 'FAKE_PREFIX',
            jiraTasksAllowedPrefixes: 'FAKE_ALLOWED_PREFIX',
            togglToken: 'FAKE_TOGGL_TOKEN'
        } as Settings;
    }

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should return error for empty jira user', () => {
        component.settingsForm.controls.jiraUser.markAsTouched();
        component.settingsForm.controls.jiraUser.setValue('');
        expect(component.jiraUserHaveErrors()).toBeTruthy();
        expect(component.mustShowJiraUserRequiredError()).toBeTruthy();
    });

    it('should return error for just whitespace on jira user', () => {
        component.settingsForm.controls.jiraUser.markAsTouched();
        component.settingsForm.controls.jiraUser.setValue('    ');
        expect(component.jiraUserHaveErrors()).toBeTruthy();
        expect(component.mustShowJiraUserRequiredError()).toBeTruthy();
    });

    it('should not return error for filled jira user', () => {
        component.settingsForm.controls.jiraUser.markAsTouched();
        component.settingsForm.controls.jiraUser.setValue('FAKE_USER');
        expect(component.jiraUserHaveErrors()).toBeFalsy();
        expect(component.mustShowJiraUserRequiredError()).toBeFalsy();
    });

    it('should return error for empty jira token', () => {
        component.settingsForm.controls.jiraToken.markAsTouched();
        component.settingsForm.controls.jiraToken.setValue('');
        expect(component.jiraTokenHaveErrors()).toBeTruthy();
        expect(component.mustShowJiraTokenRequiredError()).toBeTruthy();
    });

    it('should return error for just whitespace on jira token', () => {
        component.settingsForm.controls.jiraToken.markAsTouched();
        component.settingsForm.controls.jiraToken.setValue('    ');
        expect(component.jiraTokenHaveErrors()).toBeTruthy();
        expect(component.mustShowJiraTokenRequiredError()).toBeTruthy();
    });

    it('should not return error for filled jira token', () => {
        component.settingsForm.controls.jiraToken.markAsTouched();
        component.settingsForm.controls.jiraToken.setValue('FAKE_TOKEN');
        expect(component.jiraTokenHaveErrors()).toBeFalsy();
        expect(component.mustShowJiraTokenRequiredError()).toBeFalsy();
    });

    it('should return error for empty jira prefix', () => {
        component.settingsForm.controls.jiraPrefix.markAsTouched();
        component.settingsForm.controls.jiraPrefix.setValue('');
        expect(component.jiraPrefixHaveErrors()).toBeTruthy();
        expect(component.mustShowJiraPrefixRequiredError()).toBeTruthy();
    });

    it('should return error for just whitespace on jira prefix', () => {
        component.settingsForm.controls.jiraPrefix.markAsTouched();
        component.settingsForm.controls.jiraPrefix.setValue('    ');
        expect(component.jiraPrefixHaveErrors()).toBeTruthy();
        expect(component.mustShowJiraPrefixRequiredError()).toBeTruthy();
    });

    it('should not return error for filled jira prefix', () => {
        component.settingsForm.controls.jiraPrefix.markAsTouched();
        component.settingsForm.controls.jiraPrefix.setValue('FAKE_PREFIX');
        expect(component.jiraPrefixHaveErrors()).toBeFalsy();
        expect(component.mustShowJiraPrefixRequiredError()).toBeFalsy();
    });

    it('should return error for empty jira task allowed prefix', () => {
        component.settingsForm.controls.jiraTasksAllowedPrefixes.markAsTouched();
        component.settingsForm.controls.jiraTasksAllowedPrefixes.setValue('');
        expect(component.jiraTasksAllowedPrefixesHaveErrors()).toBeTruthy();
        expect(component.mustShowJiraTasksAllowedPrefixesRequiredError()).toBeTruthy();
    });

    it('should return error for just whitespace on jira task allowed prefix', () => {
        component.settingsForm.controls.jiraTasksAllowedPrefixes.markAsTouched();
        component.settingsForm.controls.jiraTasksAllowedPrefixes.setValue('    ');
        expect(component.jiraTasksAllowedPrefixesHaveErrors()).toBeTruthy();
        expect(component.mustShowJiraTasksAllowedPrefixesRequiredError()).toBeTruthy();
    });

    it('should not return error for filled jira task allowed prefix', () => {
        component.settingsForm.controls.jiraTasksAllowedPrefixes.markAsTouched();
        component.settingsForm.controls.jiraTasksAllowedPrefixes.setValue('FAKE_ALLOWED_PREFIX');
        expect(component.jiraTasksAllowedPrefixesHaveErrors()).toBeFalsy();
        expect(component.mustShowJiraTasksAllowedPrefixesRequiredError()).toBeFalsy();
    });

    it('should return error for empty toggl token', () => {
        component.settingsForm.controls.togglToken.markAsTouched();
        component.settingsForm.controls.togglToken.setValue('');
        expect(component.togglTokenHaveErrors()).toBeTruthy();
        expect(component.mustShowTogglTokenRequiredError()).toBeTruthy();
    });

    it('should return error for just whitespace on toggl token', () => {
        component.settingsForm.controls.togglToken.markAsTouched();
        component.settingsForm.controls.togglToken.setValue('    ');
        expect(component.togglTokenHaveErrors()).toBeTruthy();
        expect(component.mustShowTogglTokenRequiredError()).toBeTruthy();
    });

    it('should not return error for filled jtoggl token', () => {
        component.settingsForm.controls.togglToken.markAsTouched();
        component.settingsForm.controls.togglToken.setValue('FAKE_PREFIX');
        expect(component.togglTokenHaveErrors()).toBeFalsy();
        expect(component.mustShowTogglTokenRequiredError()).toBeFalsy();
    });
});
