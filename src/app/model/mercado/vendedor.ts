import {Cadastrao} from "../shared/cadastrao";
import {Endereco} from "../shared/endereco";
import {Fornecedor} from "./fornecedor";

export class Vendedor extends Cadastrao {

    _explicitType: string = 'br.com.sgsistemas.cotacao.cotacaoweb.beans.Vendedor';
    foneResidencial: string;
    foneCelular: string;
    cpf: string;
    fornecedor: Fornecedor;

    constructor(id?: number,
                nome?: string,
                dataCadastro?: string,
                foneComercial?: string,
                email?: string,
                situacao?: string,
                endereco?: Endereco,
                foneResidencial?: string,
                foneCelular?: string,
                cpf?: string,
                fornecedor?: Fornecedor) {
        super(id, nome, dataCadastro, foneComercial, email, situacao, endereco);
        this.foneResidencial = foneResidencial;
        this.foneCelular = foneCelular;
        this.cpf = cpf;
        this.fornecedor = fornecedor;
    }
}
