import {Injectable} from '@angular/core';
import {AmfAbstractService} from "../amf-abstract.service";
import {JSessionIdCookieService} from "../../storage/usuario/jsession-id-cookie.service";
import {ResponseAmf} from "../../model/shared/response-amf";
import {Cotacao} from "../../model/movimentacao/cotacao";
import {Listagem} from "../../model/shared/listagem";

@Injectable({
    providedIn: 'root'
})
export class CotacaoService extends AmfAbstractService {

    constructor(private _jSessionIdCookieService: JSessionIdCookieService) {
        super(CotacaoService.name);
    }

    listar(filtro: number, numIni: number, numFim: number, params: string[]): Promise<ResponseAmf> {
        return this._amf.invoke(CotacaoService.name, 'Listar', [filtro, numIni, numFim, params], this._jSessionIdCookieService.get());
    }

    locate(id: number): Promise<ResponseAmf> {
        return this._amf.invoke(CotacaoService.name, 'Locate', [id], this._jSessionIdCookieService.get());
    }

    locateAgrupado(map: { cotacoes: string }): Promise<ResponseAmf> {
        return this._amf.invoke(CotacaoService.name, 'LocateAgrupado', [map], this._jSessionIdCookieService.get());
    }

    saveOrUpdate(cotacao: Cotacao): Promise<ResponseAmf> {
        return this._amf.invoke(CotacaoService.name, 'SaveOrUpdate', [cotacao], this._jSessionIdCookieService.get());
    }

    alterarObservacao(cotacao: Cotacao): Promise<ResponseAmf> {
        return this._amf.invoke(CotacaoService.name, 'SalvarObservacao', [cotacao], this._jSessionIdCookieService.get());
    }

    gerarPrePedido(cotacao: Cotacao): Promise<ResponseAmf> {
        return this._amf.invoke(CotacaoService.name, 'GerarPrePedido', [cotacao], this._jSessionIdCookieService.get());
    }

    excluirCotacoes(lista: Listagem) {
        return this._amf.invoke(CotacaoService.name, 'ExcluirCotacoes', [lista], this._jSessionIdCookieService.get());
    }

    fechar(lista: Listagem) {
        return this._amf.invoke(CotacaoService.name, 'Fechar', [lista], this._jSessionIdCookieService.get());
    }

    reabrir(lista: Listagem) {
        return this._amf.invoke(CotacaoService.name, 'Reabrir', [lista], this._jSessionIdCookieService.get());
    }
}
