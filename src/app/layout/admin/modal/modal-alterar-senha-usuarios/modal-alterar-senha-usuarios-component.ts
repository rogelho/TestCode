import {AlertService} from './../../../../service/shared/alert.service';
import {ManutencaoSenha} from './../../../../model/usuario/manutencao-senha';
import {UsuarioService} from './../../../../service/usuario/usuario.service';
import {Usuario} from './../../../../model/usuario/usuario';
import {UsuarioLogadoStorageService} from './../../../../storage/usuario/usuario-logado-storage.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NotificationService} from '../../../../service/shared/notification.service';
import {MustMatchValidator} from '../../../../validator/shared/must-match-validator';
import {NotificationConst} from '../../../../const/shared/notification-const';
import {AmfUtil} from "../../../../util/amf-util";
import {UsuarioLogado} from "../../../../model/usuario/usuario-logado";
import {Fornecedor} from "../../../../model/mercado/fornecedor";
import {Option} from "../../../../model/shared/option";

@Component({
    selector: 'app-modal-alterar-senha-usuarios',
    templateUrl: './modal-alterar-senha-usuarios-component.html',
    styleUrls: ['./modal-alterar-senha-usuarios-component.scss']
})

export class ModalAlterarSenhaUsuariosComponent implements OnInit {
    private _formGroupAlterarSenha: FormGroup;
    private _isLoading: boolean;
    public styleProgress: { color: string, backgroundColor: string, width: string };
    public textProgress: string;
    public forcaSenha: number;
    public showCapsMsg: boolean;
    private buscandoUsuarios: boolean;
    private usuariosOption: Option[];
    private _usuarios: Usuario[];
    private usuarioSelecionado: Usuario;
    @Input('_usuarioLogado') _usuarioLogado: UsuarioLogado;

    constructor(
        private _formBuilder: FormBuilder,
        private _notificationService: NotificationService,
        private _alertService: AlertService,
        private _usuarioService: UsuarioService,
        private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
    ) {
    }

    @ViewChild('modalTrocarSenhaUsuarios') modalTrocarSenhaUsuarios;

    @Output() logOut = new EventEmitter();

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        this.checkCapsLock(event.getModifierState('CapsLock'));
    }

    @HostListener('window:click', ['$event'])
    handleFocus(event: MouseEvent) {
        this.checkCapsLock(event.getModifierState('CapsLock'));
    }

    checkCapsLock(isCap: boolean) {
        this.showCapsMsg = isCap;
    }

    ngOnInit() {
        this.initForm();
        this.styleProgress = {color: '', backgroundColor: '', width: ''};
        this.listar(999999, 0, 999999)
    }

    async listar(filtro: number, numIni: number, numFim: number, params: string[] = [this._usuarioLogado.usuario.cadastrao.id.toString(), '']) {
        this._usuarios = [];
        this.buscandoUsuarios = true;
        try {
            let res = await this._usuarioService.ListarExterno(filtro, numIni, numFim, params);
            if (AmfUtil.validarResponse(res)) {
                this._usuarios = res.data.body.registros;
                this.usuariosOption = await res.data.body.registros.map((usuario) => {
                    return {option: usuario.login, label: usuario.login + ' - ' + usuario.nome};
                });
                setTimeout(() => {
                    this.buscandoUsuarios = false;
                }, 1500);
            }
        } catch (e) {
            console.error(e);
            this._alertService.messageV2(NotificationConst.TITLE_WARNING, e.message, 'error');
        }
    }


    private initForm() {
        this._formGroupAlterarSenha = this._formBuilder
            .group(
                {
                    novaSenha: new FormControl('', [Validators.required, Validators.minLength(6)]),
                    confirmacaoSenha: new FormControl('', Validators.required),
                }, {
                    validators: [
                        MustMatchValidator('novaSenha', 'confirmacaoSenha')
                    ]
                });
    }

    async onAlterarSenha() {

        if (this._formGroupAlterarSenha.valid && !this._isLoading)
            try {
                this._isLoading = true;
                if (this.usuarioSelecionado) {
                    this.usuarioSelecionado.senha = this._formGroupAlterarSenha.value.novaSenha;
                    let body = new ManutencaoSenha(this.usuarioSelecionado, "", false);
                    let res = await this._usuarioService.alterarSenha(body);
                    if (this.isRespostaValido(res)) {
                        this._alertService.messageV2(NotificationConst.TITLE_SUCCESS, 'Senha alterada', 'success');
                        this.limparCampos();
                    }
                }
            } catch (e) {
                console.error(e);
                this._alertService.messageV2(NotificationConst.TITLE_WARNING, e.message, 'error');

            } finally {
                setTimeout(() => {
                    this._isLoading = false;
                }, 1000);
            }
    }


    private isRespostaValido(resposta: any): boolean {
        if (!resposta.data || !resposta.data.body) {
            this._alertService.messageV2(NotificationConst.TITLE_WARNING, 'Não foi retornado o valor do corpo na requisição!', 'warning');
            return false;
        } else if (resposta.data.body.indexOf('Sucesso') < 0) {
            this._alertService.messageV2(NotificationConst.TITLE_WARNING, resposta.data.body, 'error');
            return false;
        }
        return true;
    }

    checkStrength() {
        let novaSenha = this._formGroupAlterarSenha.value.novaSenha;
        if (novaSenha) {
            this.defineStrength(novaSenha);
            this.setProgress();
        }
    }

    defineStrength(novaSenha) {
        this.forcaSenha = 0;
        let sequencial: number = 0;
        if (novaSenha.length < 6) {
            this.forcaSenha = 0;
        } else {
            novaSenha.split('').forEach((char, index) => {
                if (index > 0) {
                    if (novaSenha.charCodeAt(index) == novaSenha.charCodeAt(index - 1) + 1) {
                        sequencial++;
                    }
                }
            })
            if (sequencial == novaSenha.length - 1) {
                this.forcaSenha = 0;
            } else {
                this.forcaSenha += 25;
            }
        }
        if (novaSenha.match(/[a-z]+/)) {
            this.forcaSenha += 10;
        }
        if (novaSenha.match(/[A-Z]+/)) {
            this.forcaSenha += 20;
        }
        if (novaSenha.match(/\d+/)) {
            this.forcaSenha += 20;
        }
        if (novaSenha.match(/\W+/)) {
            this.forcaSenha += 25;
        }
    }

    setProgress() {
        if (this.forcaSenha < 33) {
            this.textProgress = 'Senha Insuficiente';
            this.styleProgress = {width: '0%', color: '#ff0000', backgroundColor: '#ff0000'};
        } else if (this.forcaSenha >= 33 && this.forcaSenha < 66) {
            this.textProgress = 'Senha Fraca';
            this.styleProgress = {width: '33%', color: '#000000', backgroundColor: '#ffe329'};
        } else if (this.forcaSenha >= 66 && this.forcaSenha < 99) {
            this.textProgress = 'Senha Boa';
            this.styleProgress = {width: '66%', color: '#ffffff', backgroundColor: '#0023d7'};
        } else {
            this.textProgress = 'Senha Ótima';
            this.styleProgress = {width: '100%', color: '#ffffff', backgroundColor: '#008118'};
        }
    }

    open() {
        this.modalTrocarSenhaUsuarios.show();
    }

    onCloseModal() {
        this.limparCampos();
        this.modalTrocarSenhaUsuarios.hide();
    }

    limparCampos() {
        this._formGroupAlterarSenha.reset();
    }

    onChangeUsuario(event) {
        this.usuarioSelecionado = this._usuarios.find(usuario => usuario.login === event.option);
    }

    getTipoUsuaro(tipo: string) {
        let retorno = '';
        switch (tipo) {
            case "VE":
                retorno = "Vendedor";
                break;
            case "ME":
                retorno = "Mercado";
                break;
            case "FO":
                retorno = "Fornecedor";
                break;
            case "AD":
                retorno = "Administrador";
                break;
            case "FI":
                retorno = "Filial";
                break;
            default:
                retorno = "Desconhecida";
        }
        return retorno;
    }

    getStatusUsuario(situacao) {
        let retorno = '';
        switch (situacao) {
            case "A":
                retorno = "Ativo";
                break;
            case "I":
                retorno = "Inativo";
                break;
            default:
                retorno = " ";
        }
        return retorno;
    }
}
