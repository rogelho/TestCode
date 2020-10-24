import {Injectable} from '@angular/core';
import {ResponseAmf} from "../../model/shared/response-amf";
import {JSessionIdCookieService} from "../../storage/usuario/jsession-id-cookie.service";
import {AmfAbstractService} from "../amf-abstract.service";
import {ItemCotacao} from "../../model/movimentacao/item-cotacao";

@Injectable({
    providedIn: 'root'
})
export class ItensCotacaoService extends AmfAbstractService {

    constructor(private _jSessionIdCookieService: JSessionIdCookieService) {
        super(ItensCotacaoService.name);
    }

    listar(filtro: number, numIni: number, numFim: number, params: string[]): Promise<ResponseAmf> {
        return this._amf.invoke(ItensCotacaoService.name, 'Listar', [filtro, numIni, numFim, params], this._jSessionIdCookieService.get());
    }

    listarAgrupado(filtro: number, numIni: number, numFim: number, map: { cotacoes: string }): Promise<ResponseAmf> {
        return this._amf.invoke(ItensCotacaoService.name, 'ListarAgrupado', [filtro, numIni, numFim, map], this._jSessionIdCookieService.get());
    }

    alterarPrazo(itemCotacao: ItemCotacao) {
        return this._amf.invoke(ItensCotacaoService.name, 'SalvaPrazoCotacao', [itemCotacao], this._jSessionIdCookieService.get());
    }

    alterarPrazoAgrupado(itemCotacao: ItemCotacao, map: { cotacoes: string }) {
        return this._amf.invoke(ItensCotacaoService.name, 'SalvaPrazoCotacaoAgrupado', [itemCotacao, map], this._jSessionIdCookieService.get());
    }

    listarPrePedido(numIni: number, numFim: number, params: string[]): Promise<ResponseAmf> {
        return this._amf.invoke(ItensCotacaoService.name, 'ListarPrePedido', [numIni, numFim, params], this._jSessionIdCookieService.get());
    }

}
