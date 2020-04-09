import { extractTaskKey, extractTaskComment, extractTogglId } from './extractor.util';

describe('ExtractorUtil', () => {
    it('should return the task prefix when a string have a prefix in the valid prefix list', () => {
        const allowedPrefixes = ['TASK'];
        expect(extractTaskKey('This is a simples task TASK-123', allowedPrefixes)).toEqual('TASK-123');
    });

    it('should return empty when a string isn\'t in the valid prefix list', () => {
        const allowedPrefixes = ['TODO'];
        expect(extractTaskKey('This is a simples task TASK-123', allowedPrefixes)).toEqual('');
    });

    it('should return empty when the valid prefix list is empty', () => {
        const allowedPrefixes = [];
        expect(extractTaskKey('This is a simples task TASK-123', allowedPrefixes)).toEqual('');
    });

    it('should return the comment when the string have a text inside parentesis', () => {
        expect(extractTaskComment('TASK-123 (This is a simples task)')).toEqual('This is a simples task');
    });

    it('should return empty when the string don\'t have a text inside parentesis', () => {
        expect(extractTaskComment('TASK-123 This is a simple task')).toEqual('');
    });

    it('should return empty when the string don\'t have a text inside parentesis', () => {
        expect(extractTaskComment('TASK-123 ()')).toEqual('');
    });

    it('should return toggl id when the string have it after the an identifier', () => {
        expect(extractTogglId('TOGGL_ID:123456')).toEqual('123456');
    });

    it('should return empty when the string have an id with no identifier', () => {
        expect(extractTogglId('123456')).toEqual('');
    });

    it('should return empty when the string have no id with an identifier', () => {
        expect(extractTogglId('TOGGL_ID:')).toEqual('');
    });

    it('should return empty when the string is empty', () => {
        expect(extractTaskKey('', [])).toEqual('');
        expect(extractTaskComment('')).toEqual('');
        expect(extractTogglId('')).toEqual('');
    });
});
