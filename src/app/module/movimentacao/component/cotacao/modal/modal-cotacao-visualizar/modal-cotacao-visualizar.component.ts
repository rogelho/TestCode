import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Cotacao} from "../../../../../../model/movimentacao/cotacao";
import {CotacaoUtil} from "../../../../../../util/cotacao-util";
import {UsuarioLogadoStorageService} from "../../../../../../storage/usuario/usuario-logado-storage.service";
import {UsuarioLogadoUtil} from "../../../../../../util/usuario-logado-util";
import {AmfUtil} from "../../../../../../util/amf-util";
import {ItensCotacaoService} from "../../../../../../service/manutencao/itens-cotacao.service";
import {NotificationService} from "../../../../../../service/shared/notification.service";
import {NotificationConst} from "../../../../../../const/shared/notification-const";
import {ItemCotacao} from "../../../../../../model/movimentacao/item-cotacao";
import {ItemCotacaoUtil} from "../../../../../../util/item-cotacao-util";
import {TableUtil} from "../../../../../../util/table-util";
import {CotacaoService} from "../../../../../../service/manutencao/cotacao.service";
import {CodigoBarrasService} from "../../../../../../service/produto/codigo-barras.service";
import {CodigoBarrasUtil} from "../../../../../../util/codigo-barras-util";
import {AlertService} from "../../../../../../service/shared/alert.service";

@Component({
    selector: 'app-modal-cotacao-visualizar',
    templateUrl: './modal-cotacao-visualizar.component.html',
    styleUrls: ['./modal-cotacao-visualizar.component.scss']
})
export class ModalCotacaoVisualizarComponent implements OnInit {

    @ViewChild('modal') modal;

    @Output() close = new EventEmitter();

    private _tableConfig = TableUtil.getConfig();
    private _cotacao = CotacaoUtil.getInstance();
    private _rows = new Array<ItemCotacao>();
    private _usuarioLogado = UsuarioLogadoUtil.getInstance();
    private _prazo = 0;
    private _numIni = 0;
    private _numFim = 1000000;
    private _filtro = 999999;
    editing = {};

    constructor(private _usuarioLogadoStorage: UsuarioLogadoStorageService,
                private _cotacaoService: CotacaoService,
                private _itensCotacaoService: ItensCotacaoService,
                private _notificationService: NotificationService,
                private _codigoBarrasService: CodigoBarrasService,
                private _alertService: AlertService) {
    }

    ngOnInit() {
    }

    onGetMessages(): any {
        return TableUtil.getMessagesDefault();
    }

    onGetPrecoTotal(row: ItemCotacao): number {
        let desconto = ((+row.precoEmb * row.quantidade) * row.percDesc) / 100;
        return (+row.precoEmb * row.quantidade) - desconto;
    }

    async onClickCodBarra(row: ItemCotacao) {
        let res = await this._codigoBarrasService.findByClienteAndCnpjAndProduto(this._cotacao.mercado.clienteSgs, row.cnpjClienteSG, row.codigoPro);
        if (AmfUtil.validarResponse(res)) {
            let codigosBarras = res.data.body.map(r => Object.assign(CodigoBarrasUtil.getInstance(), r));
            if (codigosBarras.length)
                this._alertService.message('Códigos de barras', codigosBarras.map(c => c.codBarra).toString());
        }
    }

    async onSalvar() {
        // TODO verificar alterações dos itens pela datatable... vai ter que ser possível alterar direto na grid
        try {
            console.info('saindo');
            await this._cotacaoService.alterarObservacao(this._cotacao);
            await this.alterarPrazo();
            this.modal.hide();
            this.close.emit();
        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }

    onUpdateValue(event, cell, row) {
        this.editing[row + '-' + cell] = false;
        this._rows[row][cell] = event.target.value;
    }

    isHabilitarEditacao(): boolean {
        return !((this._cotacao.isFechado()) || this._cotacao.dataEncerramento.getTime() < new Date().getTime());
    }

    async open(cotacao: Cotacao) {
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
        this._prazo = 0;

        let res = this._usuarioLogado.isAgrupaCotacao()
            ? await this._itensCotacaoService.listarAgrupado(this._filtro, this._numIni, this._numFim, {cotacoes: this._cotacao.idCotacaoAgrupado})
            : await this._itensCotacaoService.listar(this._filtro, this._numIni, this._numFim, [this._cotacao.id.toString()]);

        if (AmfUtil.validarResponseList(res))
            setTimeout(() => {
                this._rows = res.data.body.registros.map(row => Object.assign(ItemCotacaoUtil.getInstance(), row));
                this._prazo = this._rows[0].prazo;
            }, 100);
    }

    private async alterarPrazo() {
        let itemCotacao = ItemCotacaoUtil.getInstance();
        itemCotacao.prazo = this._prazo;
        itemCotacao.fkidCotacao = this._cotacao.id;
        itemCotacao.cotacao = this._cotacao.cotacao;
        this._usuarioLogado.isAgrupaCotacao()
            ? await this._itensCotacaoService.alterarPrazoAgrupado(itemCotacao, {cotacoes: this._cotacao.idCotacaoAgrupado})
            : await this._itensCotacaoService.alterarPrazo(itemCotacao);
    }
}
