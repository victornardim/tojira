import { Injectable } from '@angular/core';
import { SettingsStorage } from 'src/app/model/settings-storage.enum';
import { DatabaseService } from 'src/app/service/database.service';
import { Settings } from 'src/app/model/settings.interface';
import { SettingsSingleton } from 'src/app/service/settings.singleton';
import { AlertService } from 'src/app/shared/component/alerts/alert.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsFacade {
    constructor(
        private database: DatabaseService,
        private singleton: SettingsSingleton,
        private alertService: AlertService) { }

    public save(settings: Settings) {
        this.database.insert(SettingsStorage.JIRA_TOKEN, settings.jiraToken);
        this.database.insert(SettingsStorage.JIRA_USER, settings.jiraUser);
        this.database.insert(SettingsStorage.JIRA_PREFIX, settings.jiraPrefix);
        this.database.insert(SettingsStorage.TOGGL_TOKEN, settings.togglToken);

        if (!!settings.freeTaskKey) {
            this.database.insert(SettingsStorage.FREE_TASK_KEY, settings.freeTaskKey);
        }

        if (settings.freeTaskTag) {
            this.database.insert(SettingsStorage.FREE_TASK_TAG, settings.freeTaskTag);
        }

        this.singleton.loadSettings();
        this.alertService.success('Settings saved successfully');
    }

    public load(): Settings {
        return {
            jiraToken: this.database.load(SettingsStorage.JIRA_TOKEN),
            jiraUser: this.database.load(SettingsStorage.JIRA_USER),
            jiraPrefix: this.database.load(SettingsStorage.JIRA_PREFIX),
            togglToken: this.database.load(SettingsStorage.TOGGL_TOKEN),
            freeTaskKey: this.database.load(SettingsStorage.FREE_TASK_KEY),
            freeTaskTag: this.database.load(SettingsStorage.FREE_TASK_TAG)
        } as Settings;
    }
}
