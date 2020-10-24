import {Cadastrao} from "../shared/cadastrao";
import {Usuario} from "../usuario/usuario";
import {Endereco} from "../shared/endereco";

export class Filial extends Cadastrao {

    _explicitType: string = 'br.com.sgsistemas.cotacao.cotacaoweb.beans.Filial';
    codFilial: number;
    cnpj: string;
    contato: string;
    usuario: Usuario;

    constructor(id?: number,
                nome?: string,
                dataCadastro?: string,
                foneComercial?: string,
                email?: string,
                situacao?: string,
                endereco?: Endereco,
                codFilial?: number,
                cnpj?: string,
                contato?: string,
                usuario?: Usuario) {
        super(id, nome, dataCadastro, foneComercial, email, situacao, endereco);
        this.codFilial = codFilial;
        this.cnpj = cnpj;
        this.contato = contato;
        this.usuario = usuario;
    }

}
