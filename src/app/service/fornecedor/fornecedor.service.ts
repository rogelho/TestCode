import {Injectable} from '@angular/core';
import {ResponseAmf} from "../../model/shared/response-amf";
import {AmfAbstractService} from "../amf-abstract.service";
import {JSessionIdCookieService} from "../../storage/usuario/jsession-id-cookie.service";
import {Fornecedor} from "../../model/mercado/fornecedor";
import {Mercado} from "../../model/mercado/mercado";
import {Endereco} from "../../model/shared/endereco";

@Injectable({
    providedIn: 'root'
})
export class FornecedorService extends AmfAbstractService {

    constructor(private _jSessionIdCookieService: JSessionIdCookieService) {
        super(FornecedorService.name);
    }

    excluirFornecedor(idUser, idFornecedor) {
        return this._amf.invoke(FornecedorService.name, 'excluiMercForn', [idUser, idFornecedor], this._jSessionIdCookieService.get());
    }

    listar(filtro: number, numIni: number, numFim: number, params: string[]): Promise<ResponseAmf> {
        return this._amf.invoke(FornecedorService.name, 'Listar', [filtro, numIni, numFim, params], this._jSessionIdCookieService.get());
    }

    locateByCnpj(cnpj: string) {
        return this._amf.invoke(FornecedorService.name, 'locateByCnpj', cnpj, this._jSessionIdCookieService.get());
    }

    async SaveOrUpdate(mercado: Mercado, fornecedor: Fornecedor) {
        let fornecedor_new = Object.assign(new Fornecedor(), fornecedor);
        fornecedor_new.endereco = Object.assign(new Endereco(), fornecedor.endereco);
        return this._amf.invoke(FornecedorService.name, 'SaveOrUpdate', [mercado, fornecedor_new], this._jSessionIdCookieService.get());
    }

    async consultaMercForn(mercado: Mercado, fornecedor: Fornecedor) {
        return this._amf.invoke(FornecedorService.name, 'consultaMercForn', [mercado, fornecedor], this._jSessionIdCookieService.get());
    }

    locate(id: number): Promise<ResponseAmf>  {
        return this._amf.invoke(FornecedorService.name, 'Locate', [id], this._jSessionIdCookieService.get());
    }

    async locateByMercado(idMercado: number, idFornecedor: number) {
        return this._amf.invoke(FornecedorService.name, 'LocateByMercado', [idMercado, idFornecedor], this._jSessionIdCookieService.get());
    }
}
