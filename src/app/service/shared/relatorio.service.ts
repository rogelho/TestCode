import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class RelatorioService {

    private _API = `${environment.urlApi}/ServletRelatorios`;

    constructor() {
    }

    openRCOT0003(idCotacoes: string[], cnpjFornecedores: string[], idUsuario: number) {
        window.open(`${this._API}?relatorio=RCOT0003&cotacoes=${idCotacoes}&fornecedor=${cnpjFornecedores}&usuariologado=${idUsuario}`);
    }

    openRCOT0002(idCotacoes: string[], idFiliais: string[], cnpjFornecedores: string[], idUsuario: number) {
        window.open(`${this._API}?relatorio=RCOT0002&cotacoes=${idCotacoes}&filial=${idFiliais}&fornecedor=${cnpjFornecedores}&usuariologado=${idUsuario}`);
    }

}
