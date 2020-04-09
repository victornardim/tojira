import { TimeInSeconds } from '../../time-in-seconds.enum';

export function getTimeISOStringWithTimezoneOffset(time: Date): string {
    const offsetInHours = (time.getTimezoneOffset() / TimeInSeconds.MINUTE);
    const parsedOffsetInHours = (offsetInHours < 0) ? (offsetInHours * -1) : offsetInHours;

    const offsetString = (parsedOffsetInHours < 10) ? `0${parsedOffsetInHours}00` : `${parsedOffsetInHours}00`;
    const offsetSignal = (offsetInHours < 0) ? '+' : '-';

    return time.toISOString().replace('Z', `${offsetSignal}${offsetString}`);
}

export function getTimeTemplate(seconds: number): string {
    if (seconds < 0) {
        throw new Error("Seconds can't be negative");
    }

    let days = 0;
    let hours = 0;
    let minutes = 0;

    if (seconds >= TimeInSeconds.DAY) {
        days = Math.floor(seconds / TimeInSeconds.DAY);
        seconds %= TimeInSeconds.DAY;
    }

    if (seconds >= TimeInSeconds.HOUR) {
        hours = Math.floor(seconds / TimeInSeconds.HOUR);
        seconds %= TimeInSeconds.HOUR;
    }

    if (seconds >= TimeInSeconds.MINUTE) {
        minutes = Math.floor(seconds / TimeInSeconds.MINUTE);
        seconds %= TimeInSeconds.MINUTE;
    }

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}