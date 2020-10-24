export class FornecedorPrecoPrazo {

    idItemGanho: number;
    cnpfFornecedor: string;
    preco: string;
    prazo: number;
    itemGanho: string;
    codFilial: number;

    constructor(idItemGanho?: number,
                cnpfFornecedor?: string,
                preco?: string,
                prazo?: number,
                itemGanho?: string,
                codFilial?: number) {
        this.idItemGanho = idItemGanho;
        this.cnpfFornecedor = cnpfFornecedor;
        this.preco = preco;
        this.prazo = prazo;
        this.itemGanho = itemGanho;
        this.codFilial = codFilial;
    }

}
