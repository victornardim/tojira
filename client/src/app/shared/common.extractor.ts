export function extractTaskKey(text: string): string {
    if (!!text) {
        const regex = /T0800-\d+/g.exec(text);

        if (!!regex) {
            const key = regex[0];

            if (!!key) {
                return key;
            }
        }
    }

    return '';
}

export function extractTogglId(text: string): string {
    if (!!text) {
        const regex = /(?:TOGGL_ID:)(\d+)/g.exec(text);

        if (!!regex) {
            const togglId = regex[1];

            if (!!togglId) {
                return togglId;
            }
        }
    }

    return '';
}