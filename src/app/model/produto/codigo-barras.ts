import {BaseBean} from "../shared/base-bean";

export class CodigoBarras extends BaseBean{

    clienteSg: number;
    cnpjClienteSg: string;
    codigoPro: number;
    codBarra: string;

    constructor(id?: number,
                clienteSg?: number,
                cnpjClienteSg?: string,
                codigoPro?: number,
                codBarra?: string) {
        super(id);
        this.clienteSg = clienteSg;
        this.cnpjClienteSg = cnpjClienteSg;
        this.codigoPro = codigoPro;
        this.codBarra = codBarra;
    }

}
