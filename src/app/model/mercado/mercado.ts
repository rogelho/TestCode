import {Filial} from "../filial/filial";
import {Cadastrao} from "../shared/cadastrao";
import {Endereco} from "../shared/endereco";

export class Mercado extends Cadastrao {

    _explicitType: string = 'br.com.sgsistemas.cotacao.cotacaoweb.beans.Mercado';
    contato: string;
    clienteSgs: number;
    cnpjClienteSG: string;
    filial: Filial;
    trabalhaTresCasasDecimais: string;

    constructor(id?: number,
                nome?: string,
                dataCadastro?: string,
                foneComercial?: string,
                email?: string,
                situacao?: string,
                endereco?: Endereco,
                contato?: string,
                clienteSgs?: number,
                cnpjClienteSG?: string,
                filial?: Filial,
                trabalhaTresCasasDecimais?: string) {
        super(id, nome, dataCadastro, foneComercial, email, situacao, endereco);
        this.contato = contato;
        this.clienteSgs = clienteSgs;
        this.cnpjClienteSG = cnpjClienteSG;
        this.filial = filial;
        this.trabalhaTresCasasDecimais = trabalhaTresCasasDecimais;
    }
}
