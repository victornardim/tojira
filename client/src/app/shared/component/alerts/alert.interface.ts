import { AlertType } from './alert.enum';

export interface Alert {
    message: string;
    time: Date;
    type: AlertType;
}
