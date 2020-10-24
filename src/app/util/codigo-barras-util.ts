import {CodigoBarras} from "../model/produto/codigo-barras";

export class CodigoBarrasUtil {

    static getInstance(): CodigoBarras {
        return new CodigoBarras();
    }

}
