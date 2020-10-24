import {Injectable} from '@angular/core';
import {AmfAbstractService} from "../amf-abstract.service";
import {JSessionIdCookieService} from "../../storage/usuario/jsession-id-cookie.service";
import {ResponseAmf} from "../../model/shared/response-amf";
import { Mercado} from "../../model/mercado/mercado";
import {Listagem} from "../../model/shared/listagem";

@Injectable({
    providedIn: 'root'
})
export class MercadoService extends AmfAbstractService {

    constructor(private _jSessionIdCookieService: JSessionIdCookieService) {
        super(MercadoService.name);
    }

    locateByCnpj(cnpj: string): Promise<ResponseAmf> {
        return this._amf.invoke(MercadoService.name, 'LocateByCnpj', [cnpj], this._jSessionIdCookieService.get());
    }

    listar(filtro: number, numIni: number, numFim: number, params: string[]): Promise<ResponseAmf> {
        return this._amf.invoke(MercadoService.name, 'Listar', [filtro, numIni, numFim, params], this._jSessionIdCookieService.get());
    }

    locate(id: number): Promise<ResponseAmf> {
        return this._amf.invoke(MercadoService.name, 'Locate', [id], this._jSessionIdCookieService.get());
    }

    async saveOrUpdate(mercado: Mercado): Promise<ResponseAmf> {
        return this._amf.invoke(MercadoService.name, 'SaveOrUpdate', [mercado], this._jSessionIdCookieService.get());
    }

    excluir(id: number) {
        return this._amf.invoke(MercadoService.name, 'Excluir', id, this._jSessionIdCookieService.get());
    }

}
