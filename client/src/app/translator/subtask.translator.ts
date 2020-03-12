import { Subtask } from '../model/subtask.interface';

export class SubtaskTranslator {
    private subtask: any;

    public translate(subtask: any): Subtask {
        this.subtask = subtask;

        return {
            id: this.subtask.id,
            comment: '',
            description: this.subtask.fields.summary
        } as Subtask;
    }
}
