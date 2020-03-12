import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    public insert(key: string, item: string) {
        if (!!item) {
            localStorage.setItem(key, item);
        }
    }

    public load(key: string): string {
        return localStorage.getItem(key);
    }

    public delete(key: string) {
        localStorage.removeItem(key);
    }
}
