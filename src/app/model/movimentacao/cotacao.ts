import {BaseBean} from "../shared/base-bean";
import {Mercado} from "../mercado/mercado";
import {Fornecedor} from "../mercado/fornecedor";

export class Cotacao extends BaseBean {

    _explicitType: string = 'br.com.sgsistemas.cotacao.cotacaoweb.beans.Cotacao';
    cotacao: number;
    dataCotacao: Date;
    cnpjClienteSG: string;
    dataFechamento: Date;
    fechadoPor: string;
    cnpjFornecedor: string;
    prazoCotacao: number;
    dataDigitacao: Date;
    prazo1: number;
    prazo2: number;
    prazo3: number;
    fechado: string;
    dataEncerramento: Date;
    mercado: Mercado;
    fornecedor: Fornecedor;
    dataAtual: Date;
    observacao: string;
    idCotacaoAgrupado: string;
    cotacaoAgrupado: string;
    cnpjFornecedorAgrupado: string;
    gerado: string;
    codFilial: number;
    existePedido: boolean;

    constructor(id?: number,
                cotacao?: number,
                dataCotacao?: Date,
                cnpjClienteSG?: string,
                dataFechamento?: Date,
                fechadoPor?: string,
                cnpjFornecedor?: string,
                prazoCotacao?: number,
                dataDigitacao?: Date,
                prazo1?: number,
                prazo2?: number,
                prazo3?: number,
                fechado?: string,
                dataEncerramento?: Date,
                mercado?: Mercado,
                fornecedor?: Fornecedor,
                dataAtual?: Date,
                observacao?: string,
                idCotacaoAgrupado?: string,
                cotacaoAgrupado?: string,
                cnpjFornecedorAgrupado?: string,
                gerado?: string,
                codFilial?: number,
                existePedido?: boolean) {
        super(id);
        this.cotacao = cotacao;
        this.dataCotacao = dataCotacao;
        this.cnpjClienteSG = cnpjClienteSG;
        this.dataFechamento = dataFechamento;
        this.fechadoPor = fechadoPor;
        this.cnpjFornecedor = cnpjFornecedor;
        this.prazoCotacao = prazoCotacao;
        this.dataDigitacao = dataDigitacao;
        this.prazo1 = prazo1;
        this.prazo2 = prazo2;
        this.prazo3 = prazo3;
        this.fechado = fechado;
        this.dataEncerramento = dataEncerramento;
        this.mercado = mercado;
        this.fornecedor = fornecedor;
        this.dataAtual = dataAtual;
        this.observacao = observacao;
        this.idCotacaoAgrupado = idCotacaoAgrupado;
        this.cotacaoAgrupado = cotacaoAgrupado;
        this.cnpjFornecedorAgrupado = cnpjFornecedorAgrupado;
        this.gerado = gerado;
        this.codFilial = codFilial;
        this.existePedido = existePedido;
    }

    isFechado(): boolean {
        return this.fechado === 'S';
    }

    isEncerrado(): boolean {
        return this.dataAtual > this.dataEncerramento;
    }

    isFechadoPor(): boolean {
        return this.fechadoPor && this.fechadoPor !== 'N';
    }

    isGerado(): boolean {
        return this.gerado == 'S';
    }
}


