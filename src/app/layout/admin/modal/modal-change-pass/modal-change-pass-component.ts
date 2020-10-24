import { AlertService } from './../../../../service/shared/alert.service';
import { ManutencaoSenha } from './../../../../model/usuario/manutencao-senha';
import { UsuarioService } from './../../../../service/usuario/usuario.service';
import { UsuarioLogadoUtil } from './../../../../util/usuario-logado-util';
import { Usuario } from './../../../../model/usuario/usuario';
import { UsuarioLogadoStorageService } from './../../../../storage/usuario/usuario-logado-storage.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { OnInit, Component, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
import { NotificationService } from '../../../../service/shared/notification.service';
import { MustMatchValidator } from '../../../../validator/shared/must-match-validator';
import { NotMustMatchValidator } from '../../../../validator/shared/not-must-match-validator';
import { NotificationConst } from '../../../../const/shared/notification-const';

@Component({
  selector: 'app-modal-change-pass',
  templateUrl: './modal-change-pass-component.html',
  styleUrls: ['./modal-change-pass-component.scss']
})

export class ModalChangePassComponent implements OnInit {

  private _formGroupAlterarSenha: FormGroup;
  private _oldSenha: string;
  private _novaSenha: string;
  private _isLoading: boolean;
  private _usuario: Usuario;
  public styleProgress: { color: string, backgroundColor: string, width: string };
  public textProgress: string;
  public passStrength: number;
  public showCapsMsg: boolean;

  constructor(
    private _formBuilder: FormBuilder,
    private _notificationService: NotificationService,
    private _alertService: AlertService,
    private _usuarioService: UsuarioService,
    private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
  ) {
  }

  @ViewChild('modal') modal;

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
    this._usuario = this._usuarioLogadoStorageService.get().usuario;
    this.styleProgress = { color: '', backgroundColor: '', width: '' };
  }

  private initForm() {
    this._formGroupAlterarSenha = this._formBuilder
      .group(
        {
          novaSenha: new FormControl('', [Validators.required, Validators.minLength(6)]),
          confirmacaoSenha: new FormControl('', Validators.required),
          oldSenha: new FormControl('', Validators.required),
        }, {
        validators: [
          MustMatchValidator('novaSenha', 'confirmacaoSenha'),
          NotMustMatchValidator('oldSenha', 'novaSenha')
        ]
      });
  }

  async onAlterarSenha() {
    if (!UsuarioLogadoUtil.canChange(this._usuario.permissoes, 'AlterarSenha')) {
      return this._alertService.messageV2(this._usuario.nome, 'Não tem permissão para alterar a senha', 'error');
    }
    if (this._formGroupAlterarSenha.valid && !this._isLoading)
      try {
        this._isLoading = true;
        let user = this._usuarioLogadoStorageService.get().usuario;
        user.senha = this._novaSenha;
        let body = new ManutencaoSenha(user, this._oldSenha, true);
        let res = await this._usuarioService.alterarSenha(body);
        if (this.isRespostaValido(res)) {
          this._alertService.messageV2(NotificationConst.TITLE_SUCCESS, 'Senha alterada', 'success');
          setTimeout(() => {
            this._isLoading = false;
            this.modal.hide();
            this.logOut.next();
          }, 1000);
        }
      } catch (e) {
        console.error(e);
        this._alertService.messageV2(NotificationConst.TITLE_WARNING, e.message, 'error');

      } finally {
        this.clearFields();
        this._isLoading = false;
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
    if (this._novaSenha) {
      this.defineStrength();
      this.setProgress();
    }
  }

  defineStrength() {
    this.passStrength = 0;
    let sequencial: number = 0;
    if (this._novaSenha.length < 6) {
      this.passStrength = 0;
    } else {
      this._novaSenha.split('').forEach((char, index) => {
        if (index > 0) {
          if (this._novaSenha.charCodeAt(index) == this._novaSenha.charCodeAt(index - 1) + 1) {
            sequencial++;
          }
        }
      })
      if (sequencial == this._novaSenha.length - 1) {
        this.passStrength = 0;
      } else {
        this.passStrength += 25;
      }
    }
    if (this._novaSenha.match(/[a-z]+/)) {
      this.passStrength += 10;
    }
    if (this._novaSenha.match(/[A-Z]+/)) {
      this.passStrength += 20;
    }
    if (this._novaSenha.match(/\d+/)) {
      this.passStrength += 20;
    }
    if (this._novaSenha.match(/\W+/)) {
      this.passStrength += 25;
    }
  }

  setProgress() {
    if (this.passStrength < 33) {
      this.textProgress = 'Senha Insuficiente';
      this.styleProgress = { width: '0%', color: '#ff0000', backgroundColor: '#ff0000' };
    } else if (this.passStrength >= 33 && this.passStrength < 66) {
      this.textProgress = 'Senha Fraca';
      this.styleProgress = { width: '33%', color: '#000000', backgroundColor: '#ffe329' };
    } else if (this.passStrength >= 66 && this.passStrength < 99) {
      this.textProgress = 'Senha Boa';
      this.styleProgress = { width: '66%', color: '#ffffff', backgroundColor: '#0023d7' };
    } else {
      this.textProgress = 'Senha Ótima';
      this.styleProgress = { width: '100%', color: '#ffffff', backgroundColor: '#008118' };
    }
  }

  open() {
    this.modal.show();
  }

  onCancel() {
    this.clearFields();
    this.modal.hide();
  }

  clearFields() {
    this._oldSenha = '';
    this._novaSenha = '';
    this._formGroupAlterarSenha.controls.confirmacaoSenha.setValue('');
    this._formGroupAlterarSenha.reset();
  }
}