import {Pedido} from "../model/movimentacao/pedido";

export class PedidoUtil {

    static getInstance() {
        let pedido = new Pedido();
        return pedido;
    }

}
