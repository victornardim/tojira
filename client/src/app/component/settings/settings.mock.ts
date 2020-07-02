import { Settings } from 'http2';

export function getSettings(): Settings {
    return {
        jiraToken: 'FAKE_JIRA_TOKEN',
        jiraUser: 'FAKE_USER',
        jiraPrefix: 'FAKE_PREFIX',
        jiraTasksAllowedPrefixes: 'FAKE_ALLOWED_PREFIX',
        togglToken: 'FAKE_TOGGL_TOKEN'
    } as Settings;
}