import {BaseBean} from "../shared/base-bean";

export class Pedido extends BaseBean {

    _explicitType: string = 'br.com.sgsistemas.cotacao.cotacaoweb.beans.Pedido';
    cnpjClienteSG: string;
    codfilial: number;
    cotacao: number;
    codigopro: number;
    descpro: string;
    qtde: number;
    qtdeemb: number;
    precounit: number;
    prazo: number;
    codbarra: number;
    cnpjfornecedor: string;
    fkidfilial: number;
    fkiditemcotacao: number;
    vendedor: string;
    lancado: Date;
    mercado: string;
    nomefornecedor: string;

    constructor(
        id?: number,
        cnpjClienteSG?: string,
        codfilial?: number,
        cotacao?: number,
        codigopro?: number,
        descpro?: string,
        qtde?: number,
        qtdeemb?: number,
        precounit?: number,
        prazo?: number,
        codbarra?: number,
        cnpjfornecedor?: string,
        fkidfilial?: number,
        fkiditemcotacao?: number,
        vendedor?: string,
        lancado?: Date,
        mercado?: string,
        nomefornecedor?: string
    ) {
        super(id);
        this.cotacao = cotacao;

        this.cnpjClienteSG = cnpjClienteSG;
        this.codfilial = codfilial;
        this.cotacao = cotacao;
        this.codigopro = codigopro;
        this.descpro = descpro;
        this.qtde = qtde;
        this.qtdeemb = qtdeemb;
        this.precounit = precounit;
        this.prazo = prazo;
        this.codbarra = codbarra;
        this.cnpjfornecedor = cnpjfornecedor;
        this.fkidfilial = fkidfilial;
        this.fkiditemcotacao = fkiditemcotacao;
        this.vendedor = vendedor;
        this.lancado = lancado;
        this.mercado = mercado;
        this.nomefornecedor = nomefornecedor
    }
}


