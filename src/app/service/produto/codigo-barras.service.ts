import {Injectable} from '@angular/core';
import {AmfAbstractService} from "../amf-abstract.service";
import {JSessionIdCookieService} from "../../storage/usuario/jsession-id-cookie.service";
import {ResponseAmf} from "../../model/shared/response-amf";

@Injectable({
    providedIn: 'root'
})
export class CodigoBarrasService extends AmfAbstractService {

    private static _API = 'CodigosBarrasService';

    constructor(private _jSessionIdCookieService: JSessionIdCookieService) {
        super(CodigoBarrasService._API);
    }

    findByClienteAndCnpjAndProduto(clienteSg: number, cnpjClienteSg: string, codigoProduto: number): Promise<ResponseAmf> {
        return this._amf.invoke(CodigoBarrasService._API, 'FindByClienteAndCnpjAndProduto', [clienteSg, cnpjClienteSg, codigoProduto], this._jSessionIdCookieService.get());
    }

}
