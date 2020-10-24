import {Vendedor} from "../model/mercado/vendedor";
import {Endereco} from "../model/shared/endereco";

export class VendedorUtil {

    static getInstance() {
        let vendedor = new Vendedor();
        vendedor.id = 0;
        vendedor.foneResidencial = "";
        vendedor.foneCelular = "";
        vendedor.foneComercial = "";
        vendedor.email = "";
        let endereco = new Endereco();
        endereco.id = 0;
        endereco.endereco = "";
        endereco.numero = "";
        endereco.bairro = "";
        endereco.cep = "__.___-___";
        vendedor.endereco = endereco;
        return vendedor;
    }

}
