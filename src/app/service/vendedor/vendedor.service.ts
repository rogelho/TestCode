import {Injectable} from '@angular/core';
import {ResponseAmf} from "../../model/shared/response-amf";
import {AmfAbstractService} from "../amf-abstract.service";
import {JSessionIdCookieService} from "../../storage/usuario/jsession-id-cookie.service";
import {Mercado} from "../../model/mercado/mercado";
import {Endereco} from "../../model/shared/endereco";
import {Vendedor} from "../../model/mercado/vendedor";
import {Fornecedor} from "../../model/mercado/fornecedor";

@Injectable({
    providedIn: 'root'
})
export class VendedorService extends AmfAbstractService {

    constructor(private _jSessionIdCookieService: JSessionIdCookieService) {
        super(VendedorService.name);
    }

    excluirVendedor(funcao, idUser, idVendedor) {
        return this._amf.invoke(VendedorService.name, funcao, [idUser, idVendedor], this._jSessionIdCookieService.get());
    }

    listarMercFornVendByFornecedor(idFornecedor: number, idUsuario: number): Promise<ResponseAmf> {
        return this._amf.invoke(VendedorService.name, 'ListarMercFornVendByFornecedor', [ idFornecedor , idUsuario], this._jSessionIdCookieService.get());
    }

    listarFornVendByFornecedor(idFornecedor: number): Promise<ResponseAmf> {
        return this._amf.invoke(VendedorService.name, 'ListarFornVendByFornecedor', [idFornecedor], this._jSessionIdCookieService.get());
    }

    listar(filtro: number, numIni: number, numFim: number, params: string[]): Promise<ResponseAmf> {
        return this._amf.invoke(VendedorService.name, 'Listar', [filtro, numIni, numFim, params], this._jSessionIdCookieService.get());
    }

    locateByCpf(cnpj: string) {
        return this._amf.invoke(VendedorService.name, 'LocateByCpf', cnpj, this._jSessionIdCookieService.get());
    }

    async SaveOrUpdate(mercado: Mercado, fornecedor: Fornecedor, vendedor: Vendedor) {
        let vendedor_new = Object.assign(new Vendedor(), vendedor);
        vendedor_new.endereco = Object.assign(new Endereco(), vendedor.endereco);
        return this._amf.invoke(VendedorService.name, 'SaveOrUpdate', [mercado, fornecedor, vendedor_new], this._jSessionIdCookieService.get());
    }

    async SaveOrUpdateMercVend(mercado: Mercado, vendedor: Vendedor) {
        let vendedor_new = Object.assign(new Vendedor(), vendedor);
        vendedor_new.endereco = Object.assign(new Endereco(), vendedor.endereco);
        return this._amf.invoke(VendedorService.name, 'SaveOrUpdate', [mercado, vendedor_new], this._jSessionIdCookieService.get());
    }

    async SaveOrUpdateVend( vendedor: Vendedor) {
        let vendedor_new = Object.assign(new Vendedor(), vendedor);
        vendedor_new.endereco = Object.assign(new Endereco(), vendedor.endereco);
        return this._amf.invoke(VendedorService.name, 'SaveOrUpdate', [vendedor_new], this._jSessionIdCookieService.get());
    }

    async consultaFornVend(fornecedor: Fornecedor, vendedor: Vendedor) {
        return this._amf.invoke(VendedorService.name, 'ConsultaFornVend', [fornecedor, vendedor], this._jSessionIdCookieService.get());
    }

    async consultaMercFornVend(mercado: Mercado, fornecedor: Fornecedor, vendedor: Vendedor) {
        return this._amf.invoke(VendedorService.name, 'ConsultaMercFornVend', [mercado, fornecedor, vendedor], this._jSessionIdCookieService.get());
    }

    locate(id: number): Promise<ResponseAmf> {
        return this._amf.invoke(VendedorService.name, 'Locate', [id], this._jSessionIdCookieService.get());
    }

    async locateByFornecedor( idVendedor: number, idFornecedor: number) {
        return this._amf.invoke(VendedorService.name, 'LocateByFornecedor', [idVendedor, idFornecedor], this._jSessionIdCookieService.get());
    }
}
