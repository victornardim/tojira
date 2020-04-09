import { Subscription } from 'rxjs';

export function doUnsubscribe(subscription: Subscription) {
    if (!!subscription && !subscription.closed) {
        subscription.unsubscribe();
    }
}

export function isSubscribed(subscription: Subscription): boolean {
    return (!!subscription && !subscription.closed);
}