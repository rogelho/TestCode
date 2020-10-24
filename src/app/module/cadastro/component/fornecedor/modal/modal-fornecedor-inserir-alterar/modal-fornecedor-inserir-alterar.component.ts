import { PessoaUtil } from './../../../../../../util/pessoa-util';
import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NotificationService} from "../../../../../../service/shared/notification.service";
import {Fornecedor} from "../../../../../../model/mercado/fornecedor";
import {FornecedorService} from "../../../../../../service/fornecedor/fornecedor.service";
import {AlertService} from "../../../../../../service/shared/alert.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AmfUtil} from "../../../../../../util/amf-util";
import {UsuarioLogado} from "../../../../../../model/usuario/usuario-logado";
import {UsuarioLogadoStorageService} from "../../../../../../storage/usuario/usuario-logado-storage.service";
import {Mercado} from "../../../../../../model/mercado/mercado";
import {NotificationConst} from "../../../../../../const/shared/notification-const";
import {MensagemConst} from "../../../../../../const/shared/mensagem-const";
import { DateUtil } from '../../../../../../util/date-util';
import { Situacao } from '../../../../../../model/shared/situacao';
import { ObjetoUtil } from './../../../../../../util/objeto-util';

@Component({
    selector: 'app-modal-fornecedor-inserir-alterar',
    templateUrl: './modal-fornecedor-inserir-alterar.component.html',
    styleUrls: ['./modal-fornecedor-inserir-alterar.scss'],
})
export class ModalFornecedorInserirAlterarComponent implements OnInit {
    @ViewChild('modal') modal;
    @Output() close = new EventEmitter();
    editando = false;
    cnpjValido: boolean = false;
    formulario: FormGroup  = new FormGroup({});
    estados: string[] = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "GO", "ES", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SP", "SC", "SE", "TO"];
    situacoes: Situacao[] = [{label: "Ativo", data: 'A'}, {label: "Inativo", data: 'I'}];
    submitted: boolean;
    submitedValidacaoCnpj: boolean;
    formularioValidaCnpj: FormGroup = new FormGroup({});
    cnpjValidado: boolean = false;
    _usuarioLogado: UsuarioLogado;

    constructor(private _fornecedorService: FornecedorService,
                private _notificationService: NotificationService,
                private _alertService: AlertService,
                private _usuarioLogadoStorageService: UsuarioLogadoStorageService) {
       
    }

    ngOnInit() {
        this.init();
    }

    init(){
        this.formularioValidaCnpj = new FormGroup({
            cnpj: new FormControl('', Validators.required),
        });


        this.formulario = new FormGroup({
            id: new FormControl(0),
            cnpj: new FormControl('', Validators.required),
            dataCadastro: new FormControl(''),
            nome: new FormControl('', Validators.required),
            fantasia: new FormControl('', Validators.required),
            contato: new FormControl('', Validators.required),
            situacao: new FormControl('A', Validators.required),
            foneComercial: new FormControl('', Validators.required),
            endereco: new FormGroup({
                    endereco: new FormControl(''),
                    numero: new FormControl(''),
                    bairro: new FormControl(''),
                    cep: new FormControl(''),
                    cidade: new FormControl('', Validators.required),
                    uf: new FormControl('PR', Validators.required),
                }
            ),
            email: new FormControl('', [Validators.email]),
        }); 
    }

    async buscaCnpj() {
        this.submitedValidacaoCnpj = true;
        this.cnpjValido = PessoaUtil.validarCNPJ(this.formularioValidaCnpj.value.cnpj.match(/\d/g).join(""));
        if (this.cnpjValido) {
            let res = await this._fornecedorService.locateByCnpj(this.formularioValidaCnpj.value.cnpj);
            if (AmfUtil.validarResponse(res)) {
                let fornecedor = ObjetoUtil.novoObjetoSemReferencia(new Fornecedor(), res.data.body);
                let mercado = ObjetoUtil.novoObjetoSemReferencia(new Mercado(), this._usuarioLogado.usuario.cadastrao);
                let consultaMercForn = await this._fornecedorService.consultaMercForn(mercado, fornecedor);
                if(AmfUtil.validarResponse(consultaMercForn)){
                    this._alertService.message("** ATENÇÃO **", "Fornecedor já pertence ao mercado!");
                }else{
                    this.formulario.patchValue(fornecedor);
                    this.cnpjValidado = true;
                }
            }else{
                this.cnpjValidado = true;
                this.formulario.controls.cnpj.setValue(this.formularioValidaCnpj.value.cnpj);
            }
        }
    }

    async open(fornecedor: Fornecedor) {
        await this.reset();
        this._usuarioLogado = this._usuarioLogadoStorageService.get();
        if(fornecedor.id > 0){
            this.editando = true;
            this.cnpjValidado = true;
            
        }else{
            fornecedor.dataCadastro = DateUtil.dataAtualFormatada();
            fornecedor.situacao = 'A';
            fornecedor.endereco.uf = 'PR'
        }

        this.formulario.patchValue(fornecedor);
        this.modal.show();
    }

    fechar() {
        this.reset()
        this.modal.hide();
    }

    reset(){
        this.formularioValidaCnpj.reset();
        this.formulario.reset();
        this.cnpjValidado = false;
    }

    async onSubmitFormulario() {
        try {
            this.submitted = true;
            let mercado = ObjetoUtil.novoObjetoSemReferencia(new Mercado(), this._usuarioLogado.usuario.cadastrao);
            let fornecedor = this.formulario.value;
            if (this.formulario.valid) {
                let res = await this._fornecedorService.SaveOrUpdate(mercado, fornecedor);
                if (AmfUtil.validarResponse(res)) {
                    let mensagem = res.data.body;
                    if (mensagem == MensagemConst.MSGSAVEUPOK) {
                        this._notificationService.success(NotificationConst.TITLE_SUCCESS, mensagem);
                        this.modal.hide();
                        this.close.emit();
                    } else {
                        this._notificationService.warning(NotificationConst.TITLE_WARNING, mensagem);
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
