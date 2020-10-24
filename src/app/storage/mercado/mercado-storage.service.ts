import {Injectable} from '@angular/core';
import {Mercado} from "../../model/mercado/mercado";
import {MercadoUtil} from "../../util/mercado-util";

@Injectable({
    providedIn: 'root'
})
export class MercadoStorageService {

    private _KEY = 'MERCADOS';

    constructor() {
    }

    public set(mercados: Mercado[]) {
        localStorage.setItem(this._KEY, JSON.stringify(mercados));
    }

    public get(): Mercado[] {
        return !!JSON.parse(localStorage.getItem(this._KEY))
            ? JSON.parse(localStorage.getItem(this._KEY)).map(mercado => Object.assign(MercadoUtil.getInstance(), mercado))
            : [];
    }

    public remove() {
        localStorage.removeItem(this._KEY);
    }

}
