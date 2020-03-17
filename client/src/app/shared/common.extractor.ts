export function extractTaskKey(text: string, allowedPrefixes: string[]): string {
    if (!!text && !!allowedPrefixes.length) {
        for (let idx = 0; idx < allowedPrefixes.length; idx++) {
            const prefix = allowedPrefixes[idx];
            const regexString = `${prefix}-\\d+`;
            const regex = new RegExp(regexString).exec(text);

            if (!!regex) {
                const key = regex[0];

                if (!!key) {
                    return key;
                }
            }
        }
    }

    return '';
}

export function extractTaskComment(text: string): string {
    if (!!text) {
        const regex = /(?:\()(.+?)(?:\))/g.exec(text);

        if (!!regex) {
            const comment = regex[1];

            if (!!comment) {
                return comment;
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