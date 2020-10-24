import {Mercado} from "../model/mercado/mercado";
import {Filial} from "../model/filial/filial";

export class MercadoUtil {

    static getInstance() {
        let mercado = new Mercado();
        mercado.filial = new Filial();
        return mercado;
    }

    static getAdmin() {
        let mercado = new Mercado();
        mercado.id = 0;
        mercado.clienteSgs = 0;
        mercado.nome = 'Administrador';
        mercado.filial = new Filial();
        return mercado;
    }

}
