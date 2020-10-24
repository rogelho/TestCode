import {Component, OnInit} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NotificationConst} from "../../../../const/shared/notification-const";
import {NotificationService} from "../../../../service/shared/notification.service";
import {RecuperaSenhaService} from "../../../../service/auth/recupera-senha.service";
import {MustMatchValidator} from "../../../../validator/shared/must-match-validator";
import {UsuarioUtil} from "../../../../util/usuario-util";
import {Usuario} from "../../../../model/usuario/usuario";
import {Router} from "@angular/router";

@Component({
    selector: 'app-esqueceu-senha',
    templateUrl: './esqueceu-senha.component.html',
    styleUrls: ['./esqueceu-senha.component.scss']
})
export class EsqueceuSenhaComponent implements OnInit {

    private _formGroupEmail: FormGroup;
    private _formGroupChave: FormGroup;
    private _formGroupAlterarSenha: FormGroup;
    private _email: string;
    private _chaveRecuperacao: string;
    private _novaSenha: string;
    private _isLoading: boolean;
    private _isSolicitandoChave: boolean;
    private _usuario = UsuarioUtil.getInstance();

    constructor(private _formBuilder: FormBuilder,
                private _notificationService: NotificationService,
                private _recuperacaoSenhaService: RecuperaSenhaService,
                private _router: Router) {
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this._isSolicitandoChave = true;
        this._formGroupEmail = this._formBuilder
            .group(
                {
                    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
                });
        this._formGroupChave = this._formBuilder
            .group(
                {
                    chaveRecuperacao: new FormControl('', [Validators.required]),
                });
        this._formGroupAlterarSenha = this._formBuilder
            .group(
                {
                    novaSenha: new FormControl('', [Validators.required, Validators.minLength(6)]),
                    confirmacaoSenha: new FormControl('', Validators.required)
                }, {
                    validators: [
                        MustMatchValidator('novaSenha', 'confirmacaoSenha')
                    ]
                });
    }

    async onEnviarChaveRecuperacao() {
        if (this._formGroupEmail.valid && !this._isLoading)
            try {
                this._isLoading = true;
                await this._recuperacaoSenhaService.enviarChaveRecuperacaoParaEmail(this._email);
                this._notificationService.success('Chave enviada com sucesso', 'A chave de recuperação foi enviada para o email informado!');
                this._isSolicitandoChave = false;
            } catch (e) {
                console.error(e);
                this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
            } finally {
                this._isLoading = false;
            }
    }

    async onRecuperarSenha() {
        if (this._formGroupChave.valid && !this._isLoading)
            try {
                this._isLoading = true;
                let res = await this._recuperacaoSenhaService.recuperarSenha(this._email, this._chaveRecuperacao);

                if (this.isRespostaValido(res)) {
                    this._usuario = Object.assign(UsuarioUtil.getInstance(), res.data.body);
                    if (!this.isUsuarioValido(this._usuario))
                        this.voltarParaSolicitacaoChave();
                }

            } catch (e) {
                console.error(e);
                this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
            } finally {
                this._isLoading = false;
            }
    }

    async onAlterarSenha() {
        if (this._formGroupAlterarSenha.valid && !this._isLoading)
            try {
                this._isLoading = true;
                let res = await this._recuperacaoSenhaService.alterarSenha(this._usuario, this._novaSenha, '', false);

                if (this.isRespostaValido(res)) {
                    this._notificationService.success('Senha alterada', res.data.body);

                    setTimeout(() => {
                        this._router.navigate(['']);
                        this._isLoading = false;
                    }, 5000);

                } else
                    this._isLoading = false;

            } catch (e) {
                console.error(e);
                this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
                this._isLoading = false;
            }
    }

    private voltarParaSolicitacaoChave() {
        this._isSolicitandoChave = true;
        this._usuario = UsuarioUtil.getInstance();
    }

    private isRespostaValido(resposta: any): boolean {
        if (!resposta.data || !resposta.data.body) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Não foi retornado o valor do corpo na requisição!');
            return false;
        }
        return true;
    }

    private isUsuarioValido(usuario: Usuario): boolean {
        if (!usuario.chave) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Chave de recuperação de senha inválida!');
            return false;
        }
        if (!usuario.dtExpiraChave) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'A chave de recuperação de senha está com data expirada! Favor solicite uma nova chave.');
            return false;
        }
        return true;
    }

    onGetVersion() {
        return environment.version;
    }

}
