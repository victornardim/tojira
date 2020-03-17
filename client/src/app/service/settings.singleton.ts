import { Injectable } from '@angular/core';
import { Settings } from '../model/settings.interface';
import { DatabaseService } from './database.service';
import { SettingsStorage } from '../model/settings-storage.enum';

@Injectable({
    providedIn: 'root'
})
export class SettingsSingleton {
    private settings: Settings;

    constructor(private database: DatabaseService) {
        this.loadSettings();
    }

    public loadSettings() {
        this.settings = {
            jiraToken: this.database.load(SettingsStorage.JIRA_TOKEN),
            jiraUser: this.database.load(SettingsStorage.JIRA_USER),
            jiraPrefix: this.database.load(SettingsStorage.JIRA_PREFIX),
            togglToken: this.database.load(SettingsStorage.TOGGL_TOKEN),
            jiraTasksAllowedPrefixes: this.database.load(SettingsStorage.JIRA_TASKS_ALLOWED_PREFIXES)
        } as Settings;
    }

    public get jiraToken(): string {
        return this.settings.jiraToken;
    }

    public get jiraUser(): string {
        return this.settings.jiraUser;
    }

    public get jiraPrefix(): string {
        return this.settings.jiraPrefix;
    }

    public get togglToken(): string {
        return this.settings.togglToken;
    }

    public get jiraTasksAllowedPrefixes(): string {
        return this.settings.jiraTasksAllowedPrefixes;
    }
}