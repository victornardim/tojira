import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { justWhitespaceValidator } from 'src/app/shared/validators/just-whitespace.validator';
import { SettingsFacade } from './settings.facade';

@Component({
    selector: 'tojira-settings',
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
    constructor(
        private formBuilder: FormBuilder,
        private facade: SettingsFacade) { }

    public settingsForm: FormGroup;

    ngOnInit() {
        this.initForm();
        this.load();
        this.settingsForm.markAllAsTouched();
    }

    private initForm() {
        this.settingsForm = this.formBuilder.group({
            jiraToken: [null, [Validators.required, justWhitespaceValidator]],
            jiraUser: [null, [Validators.required, justWhitespaceValidator]],
            jiraPrefix: [null, [Validators.required, justWhitespaceValidator]],
            togglToken: [null, [Validators.required, justWhitespaceValidator]],
            jiraTasksAllowedPrefixes: [null, [Validators.required, justWhitespaceValidator]]
        });
    }

    private load() {
        this.settingsForm.setValue(this.facade.load());
    }

    public save() {
        this.facade.save(this.settingsForm.value);
    }

    public get jiraUser(): AbstractControl {
        return this.settingsForm.controls.jiraUser;
    }

    public mustShowJiraUserRequiredError(): boolean {
        return (this.jiraUserHaveErrors() && (this.jiraUser.errors.required || this.jiraUser.errors.justWhitespace));
    }

    public jiraUserHaveErrors(): boolean {
        return (this.jiraUser.errors && this.jiraUser.touched);
    }

    public get jiraToken(): AbstractControl {
        return this.settingsForm.controls.jiraToken;
    }

    public mustShowJiraTokenRequiredError(): boolean {
        return (this.jiraTokenHaveErrors() && (this.jiraToken.errors.required || this.jiraToken.errors.justWhitespace));
    }

    public jiraTokenHaveErrors(): boolean {
        return (this.jiraToken.errors && this.jiraToken.touched);
    }

    public get jiraPrefix(): AbstractControl {
        return this.settingsForm.controls.jiraPrefix;
    }

    public mustShowJiraPrefixRequiredError(): boolean {
        return (this.jiraPrefixHaveErrors() && (this.jiraPrefix.errors.required || this.jiraPrefix.errors.justWhitespace));
    }

    public jiraPrefixHaveErrors(): boolean {
        return (this.jiraPrefix.errors && this.jiraPrefix.touched);
    }

    public get togglToken(): AbstractControl {
        return this.settingsForm.controls.togglToken;
    }

    public mustShowTogglTokenRequiredError(): boolean {
        return (this.togglTokenHaveErrors() && (this.togglToken.errors.required || this.togglToken.errors.justWhitespace));
    }

    public togglTokenHaveErrors(): boolean {
        return (this.togglToken.errors && this.togglToken.touched);
    }

    public get jiraTasksAllowedPrefixes(): AbstractControl {
        return this.settingsForm.controls.jiraTasksAllowedPrefixes;
    }

    public mustShowJiraTasksAllowedPrefixesRequiredError(): boolean {
        return (this.jiraTasksAllowedPrefixesHaveErrors() && (this.jiraTasksAllowedPrefixes.errors.required || this.jiraTasksAllowedPrefixes.errors.justWhitespace));
    }

    public jiraTasksAllowedPrefixesHaveErrors(): boolean {
        return (this.jiraTasksAllowedPrefixes.errors && this.jiraTasksAllowedPrefixes.touched);
    }
}