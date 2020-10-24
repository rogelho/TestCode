import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Cotacao} from "../../../../../../model/movimentacao/cotacao";
import {TableUtil} from "../../../../../../util/table-util";
import {CotacaoUtil} from "../../../../../../util/cotacao-util";
import {ItemCotacao} from "../../../../../../model/movimentacao/item-cotacao";
import {UsuarioLogadoUtil} from "../../../../../../util/usuario-logado-util";
import {NotificationConst} from "../../../../../../const/shared/notification-const";
import {UsuarioLogadoStorageService} from "../../../../../../storage/usuario/usuario-logado-storage.service";
import {CotacaoService} from "../../../../../../service/manutencao/cotacao.service";
import {ItensCotacaoService} from "../../../../../../service/manutencao/itens-cotacao.service";
import {NotificationService} from "../../../../../../service/shared/notification.service";

@Component({
    selector: 'app-modal-cotacao-manutencao-pre-pedido',
    templateUrl: './modal-cotacao-manutencao-pre-pedido.component.html',
    styleUrls: ['./modal-cotacao-manutencao-pre-pedido.component.scss']
})
export class ModalCotacaoManutencaoPrePedidoComponent implements OnInit {

    @ViewChild('modal') modal;

    @Output() close = new EventEmitter();

    private _tableConfig = TableUtil.getConfig();
    private _cotacao = CotacaoUtil.getInstance();
    private _rows = new Array<ItemCotacao>();
    private _usuarioLogado = UsuarioLogadoUtil.getInstance();
    private _numIni = 0;
    private _numFim = 1000000;

    constructor(private _usuarioLogadoStorage: UsuarioLogadoStorageService,
                private _cotacaoService: CotacaoService,
                private _itensCotacaoService: ItensCotacaoService,
                private _notificationService: NotificationService) {
    }

    ngOnInit() {
    }

    onGetMessages(): any {
        return TableUtil.getMessagesDefault();
    }

    async open(cotacao: Cotacao) {
        // TODO será continuado quando P.O encontrar alguém que consiga mostrar para nós como funciona...
        this._cotacao = cotacao;
        await this.load();
        this.modal.show();
    }

    private async load() {
        try {
            this._usuarioLogado = this._usuarioLogadoStorage.get();
            await this.loadItens();
        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }

    private async loadItens() {
        this._rows = new Array<ItemCotacao>();
        let res = await this._itensCotacaoService.listarPrePedido(this._numIni, this._numFim, [this._cotacao.idCotacaoAgrupado]);
        console.info('res', res);
    }
}
