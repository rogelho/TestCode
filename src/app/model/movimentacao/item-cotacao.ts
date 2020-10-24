import {BaseBean} from "../shared/base-bean";
import {FornecedorPrecoPrazo} from "./fornecedor-preco-prazo";

export class ItemCotacao extends BaseBean {

    _explicitType: string = 'br.com.sgsistemas.cotacao.cotacaoweb.beans.ItensCotacao';
    codigoPro: number;
    cnpjClienteSG: string;
    descPro: string;
    cnpjFornecedor: string;
    fantasiaFornecedor: string;
    preco: string;
    prazo: number;
    unidade: string;
    qtdeEmb: number;
    quantidade: number;
    precoEmb: string;
    cotacao: number;
    percDesc: number;
    percAcre: number;
    codBarra: number;
    fkidCotacao: number;
    itemGanho: string;
    codFilial: number;
    fornecedorPrecoPrazo: FornecedorPrecoPrazo[];

    constructor(id?: number,
                codigoPro?: number,
                cnpjClienteSG?: string,
                descPro?: string,
                cnpjFornecedor?: string,
                fantasiaFornecedor?: string,
                preco?: string,
                prazo?: number,
                unidade?: string,
                qtdeEmb?: number,
                quantidade?: number,
                precoEmb?: string,
                cotacao?: number,
                percDesc?: number,
                percAcre?: number,
                codBarra?: number,
                fkidCotacao?: number,
                itemGanho?: string,
                codFilial?: number,
                fornecedorPrecoPrazo?: FornecedorPrecoPrazo[]) {
        super(id);
        this.codigoPro = codigoPro;
        this.cnpjClienteSG = cnpjClienteSG;
        this.descPro = descPro;
        this.cnpjFornecedor = cnpjFornecedor;
        this.fantasiaFornecedor = fantasiaFornecedor;
        this.preco = preco;
        this.prazo = prazo;
        this.unidade = unidade;
        this.qtdeEmb = qtdeEmb;
        this.quantidade = quantidade;
        this.precoEmb = precoEmb;
        this.cotacao = cotacao;
        this.percDesc = percDesc;
        this.percAcre = percAcre;
        this.codBarra = codBarra;
        this.fkidCotacao = fkidCotacao;
        this.itemGanho = itemGanho;
        this.codFilial = codFilial;
        this.fornecedorPrecoPrazo = fornecedorPrecoPrazo;
    }

}
