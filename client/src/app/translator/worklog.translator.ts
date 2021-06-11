import { extractTogglId } from '../shared/util/extractor/extractor.util';

export class WorklogTranslator {
    private worklog: any;

    public translate(worklog: any) {
        this.worklog = worklog;

        return {
            id: this.worklog.id,
            comment: this.getWorklogComment(),
            togglId: this.getWorklogTogglId()
        };
    }

    private getWorklogComment(): string {
        if (!!this.worklog.comment && !!this.worklog.comment.content[0] && !!this.worklog.comment.content[0].content[0]) {
            return this.worklog.comment.content[0].content[0].text;
        }

        return '';
    }

    private getWorklogTogglId(): string {
        if (!!this.worklog.comment && !!this.worklog.comment.content[0] && !!this.worklog.comment.content[0].content[0]) {
            return extractTogglId(this.worklog.comment.content[0].content[0].text);
        }

        return '';
    }
}
