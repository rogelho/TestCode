import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Cotacao} from "../../../../../../model/movimentacao/cotacao";
import * as moment from 'moment';
import {CotacaoService} from "../../../../../../service/manutencao/cotacao.service";
import {NotificationService} from "../../../../../../service/shared/notification.service";
import {NotificationConst} from "../../../../../../const/shared/notification-const";
import {DatePipe} from "@angular/common";
import {CotacaoUtil} from "../../../../../../util/cotacao-util";

@Component({
    selector: 'app-modal-cotacao-alterar',
    templateUrl: './modal-cotacao-alterar.component.html',
    styleUrls: ['./modal-cotacao-alterar.component.scss']
})
export class ModalCotacaoAlterarComponent implements OnInit {

    @ViewChild('modal') modal;

    @Output() close = new EventEmitter();

    private _cotacao = CotacaoUtil.getInstance();
    private _dataEncerramento: string;
    private _nomeMercado: string;
    private _fechado: string;

    constructor(private _cotacaoService: CotacaoService,
                private _datepipe: DatePipe,
                private _notificationService: NotificationService) {
    }

    ngOnInit() {
    }

    async onSalvar() {
        try {
            this._cotacao.dataEncerramento = new Date(this._dataEncerramento);
            await this._cotacaoService.saveOrUpdate(this._cotacao);
            this.modal.hide();
            this.close.emit();
        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }

    onBlurDataEncerramento() {
        if (this._dataEncerramento) {
            let dataCotacao = moment(this._cotacao.dataCotacao);
            let dataEncerramento = moment(new Date(this._dataEncerramento));
            this._cotacao.prazoCotacao = dataEncerramento.diff(dataCotacao, 'days');
        }
    }

    onChangePrazo() {
        // TODO GMT está +1 fazendo com que sempre que editado é somado 1h a mais...
        if (this._dataEncerramento) {
            let dt = new Date(this._dataEncerramento);
            let dataEncerramento = moment(this._cotacao.dataCotacao)
                .add(this._cotacao.prazoCotacao, 'days')
                .add(dt.getHours(), 'hours')
                .add(dt.getMinutes(), 'minutes');
            this._dataEncerramento = this._datepipe.transform(dataEncerramento.toDate(), 'yyyy-MM-ddTHH:mm');
        }
    }

    open(cotacao: Cotacao) {
        this._cotacao = cotacao;
        this.load();
        this.modal.show();
    }

    private load() {
        this._dataEncerramento = this._datepipe.transform(new Date(this._cotacao.dataEncerramento), 'yyyy-MM-ddTHH:mm:ss');
        this._nomeMercado = this.getNomeMercado();
        this._fechado = this._cotacao.isFechado() ? 'Sim' : 'Não';
    }

    private getNomeMercado(): string {
        return `${this._cotacao.mercado.clienteSgs} - ${this._cotacao.mercado.nome}`
    }

}
