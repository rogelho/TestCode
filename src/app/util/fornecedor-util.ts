import {Fornecedor} from "../model/mercado/fornecedor";
import { EnderecoUtil } from './endereco-util';

export class FornecedorUtil {

    static getInstance() {
        let fornecedor = new Fornecedor();
        fornecedor.email = "";
        fornecedor.endereco = EnderecoUtil.getInstance();
        return fornecedor;
    }
}
