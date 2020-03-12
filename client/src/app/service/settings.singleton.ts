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
            freeTaskKey: this.database.load(SettingsStorage.FREE_TASK_KEY),
            freeTaskTag: this.database.load(SettingsStorage.FREE_TASK_TAG)
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

    public get freeTaskKey(): string {
        return this.settings.freeTaskKey;
    }

    public get freeTaskTag(): string {
        return this.settings.freeTaskTag;
    }

    public get togglToken(): string {
        return this.settings.togglToken;
    }
}