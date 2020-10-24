import { Endereco } from '../model/shared/endereco';

export class EnderecoUtil {

    static getInstance() {
        let endereco = new Endereco();
        endereco.endereco = "";
        endereco.numero = "";
        endereco.cidade = "";
        endereco.bairro = "";
        endereco.cep = "";
        endereco.uf = "";
        return endereco;
    }

}
