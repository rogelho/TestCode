import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Mercado} from "../../../../model/mercado/mercado";
import {MercadoStorageService} from "../../../../storage/mercado/mercado-storage.service";
import {LoginService} from "../../../../service/auth/login.service";
import {AmfUtil} from "../../../../util/amf-util";
import {UsuarioUtil} from "../../../../util/usuario-util";
import {UsuarioLogadoStorageService} from "../../../../storage/usuario/usuario-logado-storage.service";

class Option {
    value: string;
    label: string;

    constructor(value: string,
                label: string) {
        this.value = value;
        this.label = label;
    }

}

@Component({
    selector: 'app-filial',
    templateUrl: './filial.component.html',
    styleUrls: ['./filial.component.scss']
})
export class FilialComponent implements OnInit {

    @Input() _title = 'Selecione um mercado';
    @Output() onChange = new EventEmitter();

    private _mercados: Mercado[] = new Array<Mercado>();
    private _options: Option[] = new Array<Option>();
    private _optionSelected: string;

    constructor(private _mercadoStorage: MercadoStorageService,
                private _loginService: LoginService,
                private _usuarioLogadoStorage: UsuarioLogadoStorageService) {
    }

    ngOnInit() {
        this.mapMercadosToOptions();
        this.selectOptionByUsuarioLogado();
    }

    async onModelChange() {
        await this.trocarUsuario();
        this.onChange.emit(this._optionSelected);
    }

    private selectOptionByUsuarioLogado() {
        let usuarioLogado = this._usuarioLogadoStorage.get();
        this.setOptionSelected(usuarioLogado.usuario.cadastrao.id.toString());
    }

    private setOptionSelected(idCadastrao: string) {
        this._optionSelected = idCadastrao;
    }

    private mapMercadosToOptions() {
        this._mercados = this._mercadoStorage.get();
        if (this._mercados.length)
            this._options = this._mercados.map(mercado => new Option(mercado.id.toString(), `${mercado.clienteSgs} - ${mercado.nome}`));
    }

    private async trocarUsuario() {
        try {
            let res = await this._loginService.trocarUsuario(+this._optionSelected);

            if (AmfUtil.validarResponse(res)) {
                let usuarioLogado = this._usuarioLogadoStorage.get();
                usuarioLogado.usuario = Object.assign(UsuarioUtil.getInstance(), res.data.body);
                this._usuarioLogadoStorage.set(usuarioLogado);
            }
        } catch (e) {
            console.error('[FilialComponent] Erro ao trocar a pesquisa', e);
        }
    }

}
