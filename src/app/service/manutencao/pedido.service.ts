import {Injectable} from '@angular/core';
import {AmfAbstractService} from "../amf-abstract.service";
import {JSessionIdCookieService} from "../../storage/usuario/jsession-id-cookie.service";
import {ResponseAmf} from "../../model/shared/response-amf";
import {Listagem} from "../../model/shared/listagem";

@Injectable({
    providedIn: 'root'
})
export class PedidoService extends AmfAbstractService {

    constructor(private _jSessionIdCookieService: JSessionIdCookieService) {
        super(PedidoService.name);
    }

    listar(filtro: number, numIni: number, numFim: number, params: string[]): Promise<ResponseAmf> {
        return this._amf.invoke(PedidoService.name, 'Listar', [filtro, numIni, numFim, params], this._jSessionIdCookieService.get());
    }

    excluirPedidos(lista: Listagem) {
        return this._amf.invoke(PedidoService.name, 'ExcluirPedido', [lista], this._jSessionIdCookieService.get());
    }
}
