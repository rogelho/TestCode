import {ItemCotacao} from "../model/movimentacao/item-cotacao";
import {FornecedorPrecoPrazo} from "../model/movimentacao/fornecedor-preco-prazo";

export class ItemCotacaoUtil {

    static getInstance(): ItemCotacao {
        let itemCotacao = new ItemCotacao();
        itemCotacao.fornecedorPrecoPrazo = Array<FornecedorPrecoPrazo>();
        return itemCotacao;
    }

}
