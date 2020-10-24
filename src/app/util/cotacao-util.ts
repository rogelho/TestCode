import {Cotacao} from "../model/movimentacao/cotacao";
import {Mercado} from "../model/mercado/mercado";
import {Fornecedor} from "../model/mercado/fornecedor";

export class CotacaoUtil {

    static getInstance() {
        let cotacao = new Cotacao();
        cotacao.mercado = new Mercado();
        cotacao.fornecedor = new Fornecedor();
        return cotacao;
    }

}
