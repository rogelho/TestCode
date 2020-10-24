import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {UsuarioLogado} from "../../../../../../model/usuario/usuario-logado";
import {Filial} from "../../../../../../model/filial/filial";
import {FilialService} from "../../../../../../service/filial/filial.service";
import {NotificationService} from "../../../../../../service/shared/notification.service";
import {AlertService} from "../../../../../../service/shared/alert.service";
import {UsuarioLogadoStorageService} from "../../../../../../storage/usuario/usuario-logado-storage.service";
import {Mercado} from "../../../../../../model/mercado/mercado";
import {AmfUtil} from "../../../../../../util/amf-util";
import {MensagemConst} from "../../../../../../const/shared/mensagem-const";
import {NotificationConst} from "../../../../../../const/shared/notification-const";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Situacao} from "../../../../../../model/shared/situacao";
import {DateUtil} from "../../../../../../util/date-util";
import { PessoaUtil } from '../../../../../../util/pessoa-util';

@Component({
    selector: 'app-modal-filial-empresa-inserir-alterar',
    templateUrl: './modal-filial-empresa-inserir-alterar.component.html',
    styleUrls: ['./modal-filial-empresa-inserir-alterar.scss'],
})
export class ModalFilialEmpresaInserirAlterarComponent implements OnInit {
    @ViewChild('modalFilialEmpresaInserirAlterarComponent') modalFilialEmpresaInserirAlterarComponent;
    @Output() close = new EventEmitter();
    private cnpjValido: boolean = false;
    private formulario: FormGroup;
    estados: string[] = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "GO", "ES", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SP", "SC", "SE", "TO"];
    situacoes: Situacao[] = [{label: "Ativo", data: 'A'}, {label: "Inativo", data: 'I'}];
    submitted: boolean;
    submitedValidacaoCnpj: boolean;
    formularioValidaCnpj: FormGroup;
    cnpjValidado: boolean = false;
    _usuarioLogado: UsuarioLogado;
    editando: boolean;

    constructor(private _filialService: FilialService,
                private _notificationService: NotificationService,
                private _alertService: AlertService,
                private _usuarioLogadoStorageService: UsuarioLogadoStorageService) {

        this.formularioValidaCnpj = new FormGroup({
            cnpj: new FormControl('', Validators.required),
        });

        this.formulario = new FormGroup({
            id: new FormControl(0),
            dataCadastro: new FormControl(''),
            nome: new FormControl('', Validators.required),
            contato: new FormControl('', Validators.required),
            codFilial: new FormControl('', [Validators.required, Validators.min(1)]),
            cnpj: new FormControl('', Validators.required),
            foneComercial: new FormControl('', Validators.required),
            situacao: new FormControl('A', Validators.required),
            email: new FormControl('', [Validators.email]),
            endereco: new FormGroup({
                    id: new FormControl(0),
                    endereco: new FormControl('', Validators.required),
                    numero: new FormControl('', Validators.required),
                    bairro: new FormControl('', Validators.required),
                    cep: new FormControl('', Validators.required),
                    cidade: new FormControl('', Validators.required),
                    uf: new FormControl('PR', Validators.required),
                }
            ),
        });
    }

    ngOnInit() {
    }

    async buscaCnpj() {
        this.submitedValidacaoCnpj = true;
        this.cnpjValido = PessoaUtil.validarCNPJ(this.formularioValidaCnpj.value.cnpj.match(/\d/g).join(""));
        if (this.cnpjValido) {
            let res = await this._filialService.locateByCnpj(this.formularioValidaCnpj.value.cnpj);
            if (AmfUtil.validarResponse(res)) {
                    this._alertService.message("** ATENÇÃO **", "Cnpj já cadastrado!");
            }else{
                this.cnpjValidado = true;
                this.formulario.controls.cnpj.setValue(this.formularioValidaCnpj.value.cnpj);
            }
        }
    }

    open(filial: Filial) {
        this.resetCampos();
        this._usuarioLogado = this._usuarioLogadoStorageService.get();
        if(filial.id > 0){
            this.editando = true;
            this.cnpjValidado = true;
        }else{
            filial.dataCadastro = DateUtil.dataAtualFormatada();
            filial.situacao = 'A';
            filial.endereco.uf = 'PR'
        }
        this.formulario.patchValue(filial);
        this.modalFilialEmpresaInserirAlterarComponent.show();
    }

    resetCampos() {
        this.formularioValidaCnpj.reset();
        this.formulario.reset();
        this.cnpjValidado = false;
    }

    fechar(){
        this.resetCampos();
        this.modalFilialEmpresaInserirAlterarComponent.hide();
    }


    async onSubmitFormulario() {
        try {
            this.submitted = true;
            let mercado = this._usuarioLogado.usuario.cadastrao as Mercado;
            let filial = this.formulario.value as Filial;
            if (this.formulario.valid) {
                let res = await this._filialService.SaveOrUpdate(mercado, filial);
                if (AmfUtil.validarResponse(res)) {
                    let mensagem = res.data.body;
                    if (mensagem == MensagemConst.MSGSAVEUPOK) {
                        this._notificationService.success(NotificationConst.TITLE_SUCCESS, mensagem);
                        this.modalFilialEmpresaInserirAlterarComponent.hide();
                        this.close.emit();
                    } else {
                        this._notificationService.warning(NotificationConst.TITLE_WARNING, this.getMensagemErro(mensagem));
                    }
                }
            }
        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, this.getMensagemErro(e.message));
        }
    }

    private getMensagemErro(mensagem) {
        let mensagemArray = mensagem.split(':');
        return mensagemArray.length > 1 ? mensagemArray[1] : mensagemArray[0];
    }
}
