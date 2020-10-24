import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class JSessionIdCookieService {

    private _KEY = 'JSESSIONID';

    constructor() {
    }

    public set(jSessionId: string) {
        localStorage.setItem(this._KEY, jSessionId);
    }

    public get(): string {
        return localStorage.getItem(this._KEY);
    }

    public remove() {
        localStorage.removeItem(this._KEY);
    }

}
