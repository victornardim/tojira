import { Alert } from './alert.interface';
import { AlertType } from './alert.enum';

export function getAlert(): Alert {
    return {
        message: 'Alert message',
        time: new Date(),
        type: AlertType.SUCCESS
    } as Alert;
}

export function getAlerts(): Alert[] {
    return [
        {
            message: 'Simple alert message',
            time: new Date('2019-09-28 01:00:00'),
            type: AlertType.INFO
        },
        {
            message: 'Error',
            time: new Date('2019-09-28 02:00:00'),
            type: AlertType.DANGER
        }] as Alert[];
}