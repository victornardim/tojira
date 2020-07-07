import { getTimeISOStringWithTimezoneOffset, getTimeTemplate } from './date.util';

describe('DateUtil', () => {
    it('should return a valid ISO time string with timezone offset when date is valid', () => {
        const date = new Date('01-01-2020 00:00:00');
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        expect(getTimeISOStringWithTimezoneOffset(date)).toEqual('2020-01-01T00:00:00.000-0300');
    });

    it('should return a valid time template when seconds are superior than zero', () => {
        expect(getTimeTemplate(101401)).toEqual('1d 4h 10m 1s');
    });

    it('should return a valid time template when seconds are zero', () => {
        expect(getTimeTemplate(0)).toEqual('0d 0h 0m 0s');
    });

    it('should return a valid time template when seconds are negative', () => {
        try {
            const time = getTimeTemplate(-120);
        } catch (ex) {
            expect(ex.message).toEqual('Seconds can\'t be negative');
        }
    });
});
