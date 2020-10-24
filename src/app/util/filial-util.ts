import {Filial} from "../model/filial/filial";
import { Endereco } from '../model/shared/endereco';

export class FilialUtil {

    static getInstance() {
        let filial = new Filial();
        filial.endereco = new Endereco();
        filial.email = "";
        return filial;
    }

}
