import {Component, OnInit} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UsuarioLogadoStorageService} from "../../../../storage/usuario/usuario-logado-storage.service";
import {MustMatchValidator} from "../../../../validator/shared/must-match-validator";
import {NotMustMatchValidator} from "../../../../validator/shared/not-must-match-validator";
import {NotificationConst} from "../../../../const/shared/notification-const";
import {NotificationService} from "../../../../service/shared/notification.service";
import {MustMatchStrEqualMd5Validator} from "../../../../validator/shared/must-match-str-equal-md5-validator";
import {UsuarioService} from "../../../../service/usuario/usuario.service";
import {ManutencaoSenha} from "../../../../model/usuario/manutencao-senha";
import {UsuarioLogado} from "../../../../model/usuario/usuario-logado";
import {LoginService} from "../../../../service/auth/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-primeiro-acesso',
  templateUrl: './primeiro-acesso.component.html',
  styleUrls: ['./primeiro-acesso.component.scss']
})
export class PrimeiroAcessoComponent implements OnInit {

  private _formGroup: FormGroup;
  private _usuarioLogado: UsuarioLogado;
  private _novaSenha: string;
  private _isLoading: boolean;

  constructor(private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
              private _usuarioService: UsuarioService,
              private _notificationService: NotificationService,
              private _loginService: LoginService,
              private _router: Router,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this._usuarioLogado = this._usuarioLogadoStorageService.get();

    this._formGroup = this._formBuilder
      .group(
        {
          senhaAntigaOculto: new FormControl(this._usuarioLogado.usuario.senha),
          senhaAntiga: new FormControl('', [Validators.required]),
          senhaNova: new FormControl('', Validators.required),
          confirmacaoSenha: new FormControl('', Validators.required)
        },
        {
          validators: [
            MustMatchValidator('senhaNova', 'confirmacaoSenha'),
            MustMatchStrEqualMd5Validator('senhaAntigaOculto', 'senhaAntiga'),
            NotMustMatchValidator('senhaAntiga', 'senhaNova')
          ]
        });
  }

  onGetVersion() {
    return environment.version;
  }

  async onSubmit() {
    if (this._formGroup.valid && !this._isLoading)
      try {
        this._isLoading = true;

        this._usuarioLogado.usuario.senha = this._novaSenha;
        let manutencaoSenha = new ManutencaoSenha(this._usuarioLogado.usuario, '', false);

        await this._usuarioService.alterarSenha(manutencaoSenha);
        await this._loginService.logOut();

        this._notificationService.success('Senha alterada com sucesso', 'Será necessário logar novamente!');

        setTimeout(() => {
          this._router.navigate(['']);
          this._isLoading = false;
        }, 5000);

      } catch (e) {
        console.error(e);
        this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        this._isLoading = false;
      }
  }

  async onVoltarAoLogin() {
    await this._loginService.logOut();
    this._router.navigate(['']);
  }

}
