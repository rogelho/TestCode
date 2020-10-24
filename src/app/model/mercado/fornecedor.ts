import {Cadastrao} from "../shared/cadastrao";
import {Endereco} from "../shared/endereco";

export class Fornecedor extends Cadastrao {

    _explicitType: string = 'br.com.sgsistemas.cotacao.cotacaoweb.beans.Fornecedor';
    fantasia: string;
    contato: string;
    cnpj: string;

    constructor(id?: number,
                nome?: string,
                dataCadastro?: string,
                foneComercial?: string,
                email?: string,
                situacao?: string,
                endereco?: Endereco,
                fantasia?: string,
                contato?: string,
                cnpj?: string) {
        super(id, nome, dataCadastro, foneComercial, email, situacao, endereco);
        this.fantasia = fantasia;
        this.contato = contato;
        this.cnpj = cnpj;
    }

}
