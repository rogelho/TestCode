import {Endereco} from "./endereco";
import {BaseBean} from "./base-bean";

export class Cadastrao extends BaseBean {

    _explicitType: string = 'br.com.sgsistemas.cotacao.cotacaoweb.beans.Cadastrao';
    nome: string;
    dataCadastro: string;
    foneComercial: string;
    email: string;
    situacao: string;
    endereco: Endereco;

    constructor(id?: number,
                nome?: string,
                dataCadastro?: string,
                foneComercial?: string,
                email?: string,
                situacao?: string,
                endereco?: Endereco) {
        super(id);
        this.nome = nome;
        this.dataCadastro = dataCadastro;
        this.foneComercial = foneComercial;
        this.email = email;
        this.situacao = situacao;
        this.endereco = endereco;
    }

}
