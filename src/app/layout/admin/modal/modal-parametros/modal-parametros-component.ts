import { AlertService } from './../../../../service/shared/alert.service';
import { UsuarioLogadoStorageService } from './../../../../storage/usuario/usuario-logado-storage.service';
import { UsuarioLogado } from './../../../../model/usuario/usuario-logado';
import { UsuarioLogadoUtil } from './../../../../util/usuario-logado-util';
import { RegistroParametro } from './../../interface/parametro-interface';
import { OnInit, ViewChild, Output, EventEmitter, Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ParametroService } from '../../../../service/manutencao/parametro.service';
import { NotificationConst } from '../../../../const/shared/notification-const';

@Component({
  selector: 'app-modal-param',
  templateUrl: './modal-parametros-component.html',
  styleUrls: ['./modal-parametros-component.scss']
})

export class ModalParamComponent implements OnInit {
  private _formGroupParam: FormGroup;
  private _registerParam: Array<RegistroParametro>;
  private _isLoading: boolean = false;
  private _usuarioLogado: UsuarioLogado;

  constructor(
    private _formBuilder: FormBuilder,
    private _parametroService: ParametroService,
    private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
    private _alertService: AlertService,
  ) { }

  @ViewChild('modal') modal;

  @Output() close = new EventEmitter();

  ngOnInit() {
    this.getRegister();
    this.initForm();
    this._usuarioLogado = this._usuarioLogadoStorageService.get();
  }

  async getRegister() {
    this._registerParam = [{ valorParametro: '1' }, { valorParametro: '1' }];
    const registros = await this._parametroService.get();
    this._registerParam = registros.data.body.registros;
  }

  private initForm() {
    this._formGroupParam = this._formBuilder
      .group(
        {
          newOrder: new FormControl('', [Validators.required]),
          newPrice: new FormControl('', Validators.required),
        }
      );
  }

  open() {
    this.modal.show();
  }

  onCancel() {
    this.modal.hide();
  }

  async onParam() {
    if (!UsuarioLogadoUtil.canChange(this._usuarioLogado.usuario.permissoes, 'Parametros')) {
      return this._alertService.messageV2(this._usuarioLogado.usuario.nome, 'Não possui permissão para alterar', 'error');
    }
    if (this._formGroupParam.valid && !this._isLoading) {
      try {
        this._registerParam.forEach(item => item.valorParametro = item.valorParametro.toString());
        this._isLoading = true;
        let resp = await this._parametroService.save(this._registerParam);
        if (this.isRespostaValido(resp)) {
          this._alertService.messageV2('Parâmetros salvos', resp.data.body, 'success');
          setTimeout(() => {
            this._isLoading = false;
            this.modal.hide();
          }, 5000)
        } else {
          this._isLoading = false;
        }
      } catch (error) {
        console.error(error);
        this._alertService.messageV2(NotificationConst.TITLE_DEFAULT, error.message, 'error');
        this._isLoading = false;
      }
    }
  }

  private isRespostaValido(resposta: any): boolean {
    if (!resposta.data || !resposta.data.body) {
      this._alertService.messageV2(NotificationConst.TITLE_WARNING, 'Não foi retornado o valor do corpo na requisição!', 'warning');
      return false;
    }
    return true;
  }
}