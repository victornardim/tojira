import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class JiraService {
    constructor(private http: HttpClient) { }

    public getTask(key: string, token: string): Observable<any> {
        const url = `http://localhost:5000/jira/task/${key}`;

        const headers = new HttpHeaders()
            .set('token', token);

        return this.http.get(url, { headers });
    }

    public deleteWorklog(key: string, id: string, token: string): Observable<any> {
        const url = `http://localhost:5000/jira/task/${key}/worklog/${id}`;

        const headers = new HttpHeaders()
            .set('token', token);

        return this.http.delete(url, { headers });
    }

    public registerWorklog(key: string, worklog: any, token: string): Observable<any> {
        const url = `http://localhost:5000/jira/task/${key}/worklog`;

        const headers = new HttpHeaders()
            .set('token', token)
            .set('content-type', "application/json");

        return this.http.post(url, worklog, { headers });
    }
}
