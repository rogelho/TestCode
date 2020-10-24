import {Component, OnInit} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {Usuario} from "../../../../model/usuario/usuario";
import {UsuarioUtil} from "../../../../util/usuario-util";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../../../service/auth/login.service";
import {NotificationService} from "../../../../service/shared/notification.service";
import {UsuarioLogado} from "../../../../model/usuario/usuario-logado";
import {ActivatedRoute, Router} from "@angular/router";
import {LembraMeStorageService} from "../../../../storage/usuario/lembra-me-storage.service";
import {UsuarioLembrarMe} from "../../../../model/usuario/usuario-lembrar-me";
import {NotificationConst} from "../../../../const/shared/notification-const";
import {UsuarioLogadoStorageService} from "../../../../storage/usuario/usuario-logado-storage.service";
import {JSessionIdCookieService} from "../../../../storage/usuario/jsession-id-cookie.service";
import {LoginUtil} from "../../../../util/login-util";
import {AmfUtil} from "../../../../util/amf-util";
import {MercadoUtil} from "../../../../util/mercado-util";
import {MercadoService} from "../../../../service/mercado/mercado.service";
import {MercadoStorageService} from "../../../../storage/mercado/mercado-storage.service";
import {UsuarioLogadoUtil} from "../../../../util/usuario-logado-util";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    private _usuario: Usuario;
    private _formGroup: FormGroup;
    private _isLoading: boolean;
    private _lembrarMe: boolean;

    constructor(private _loginService: LoginService,
                private _notificationService: NotificationService,
                private _router: Router,
                private _activatedRoute: ActivatedRoute,
                private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
                private _jSessionIdCookieService: JSessionIdCookieService,
                private _lembraMeStorageService: LembraMeStorageService,
                private _mercadoService: MercadoService,
                private _mercadoStorage: MercadoStorageService) {
    }

    ngOnInit() {
        this.initForm();
    }

    async onSubmit() {
        if (this._formGroup.valid && !this._isLoading)
            try {

                this._isLoading = true;
                let response = await this._loginService.login(this._usuario);

                if (this.isRespostaLoginValido(response)) {
                    let usuarioLogado = Object.assign(new UsuarioLogado(), response.data.body);
                    let jSessionId = LoginUtil.getJSessionId(response);

                    if (this.isUsuarioLogadoValido(usuarioLogado) && jSessionId) {
                        await this.entrar(usuarioLogado, jSessionId);
                    }
                }

            } catch (e) {
                console.error(e);
                this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
            } finally {
                this._isLoading = false;
            }
    }

    onGetVersion() {
        return environment.version;
    }

    private initForm() {
        this._usuario = this.getUsuario();

        this._formGroup = new FormGroup({
            usuario: new FormControl('', [Validators.required]),
            senha: new FormControl('', Validators.required)
        });
    }

    private isRespostaLoginValido(resposta: any): boolean {
        if (!resposta.data || !resposta.data.body) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Usuário ou senha inválidos!');
            return false;
        }
        if (!resposta.headers) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Não retornado headers na requisição!');
            return false;
        }
        return true;
    }

    private isUsuarioLogadoValido(usuarioLogado: UsuarioLogado): boolean {
        if (!usuarioLogado.isAtivo()) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Usuário está inativo, entre em contato com o administrador!');
            return false;
        }
        return true;
    }

    private setLembrarMe() {
        this._lembrarMe
            ? this._lembraMeStorageService.set(new UsuarioLembrarMe(this._usuario.login, this._usuario.senha, this._lembrarMe))
            : this._lembraMeStorageService.remove();
    }

    private getUsuario(): Usuario {
        let usuarioLembrarMe = this._lembraMeStorageService.get();

        if (usuarioLembrarMe && usuarioLembrarMe.lembrarMe) {
            this._lembrarMe = usuarioLembrarMe.lembrarMe;
            return this._usuario = Object.assign(UsuarioUtil.getInstance(), usuarioLembrarMe);
        }

        return UsuarioUtil.getInstance();
    }

    private async entrar(usuarioLogado: UsuarioLogado, jSessionId: string) {
        this._usuarioLogadoStorageService.set(usuarioLogado);
        this._jSessionIdCookieService.set(jSessionId);
        this.setLembrarMe();
        UsuarioLogadoUtil.isPrimeiroAcesso(usuarioLogado)
            ? await this._router.navigate(['auth/primeiro-acesso'], {state: {senhaAntiga: this._usuario.senha}})
            : await this.irParaPrimeiraPagina(usuarioLogado);
    }

    private async irParaPrimeiraPagina(usuarioLogado: UsuarioLogado) {
        if (usuarioLogado.isAdmin())
            await this.carregarMercados();
        await this._router.navigate(['/movimentacao']);
    }

    private async carregarMercados() {
        try {
            let res = await this._mercadoService.listar(999999, 0, 999999, ["0", "999999"]);
            if (AmfUtil.validarResponseList(res)) {
                let mercados = res.data.body.registros.map(row => Object.assign(MercadoUtil.getInstance(), row));
                mercados.unshift(MercadoUtil.getAdmin());
                this._mercadoStorage.set(mercados);
            }
        } catch (e) {
            console.error('[LoginComponent] Erro ao carregar mercados', e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }

}

