import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TogglService {
    constructor(private http: HttpClient) { }

    public getTimeEntries(start: string, end: string, token: string): Observable<any> {
        const url = `http://localhost:5000/toggl/timeEntries/${start}/${end}`;

        const headers = new HttpHeaders()
            .set('token', token);

        return this.http.get(url, { headers });
    }
}
