import { PessoaUtil } from './../../../../../../util/pessoa-util';
import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NotificationService} from "../../../../../../service/shared/notification.service";
import {MercadoUtil} from "../../../../../../util/mercado-util";
import {Mercado} from "../../../../../../model/mercado/mercado";
import {Endereco} from "../../../../../../model/shared/endereco";
import {Filial} from "../../../../../../model/filial/filial";
import {MercadoService} from "../../../../../../service/mercado/mercado.service";
import {NotificationConst} from "../../../../../../const/shared/notification-const";
import {AlertService} from "../../../../../../service/shared/alert.service";
import {MensagemConst} from "../../../../../../const/shared/mensagem-const";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AmfUtil} from '../../../../../../util/amf-util';
import {UsuarioLogado} from "../../../../../../model/usuario/usuario-logado";
import {UsuarioLogadoStorageService} from "../../../../../../storage/usuario/usuario-logado-storage.service";

@Component({
    selector: 'app-modal-mercado',
    templateUrl: './modal-mercado.component.html',
    styleUrls: ['./modal-mercado.component.scss']
})
export class ModalMercadoComponent implements OnInit {
    @ViewChild('modal') modal;
    @ViewChild('ctdTabset') ctdTabset;
    @Output() close = new EventEmitter();
    private _mercado = MercadoUtil.getInstance();
    private formulario: FormGroup;
    estados: string[] = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "GO", "ES", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SP", "SC", "SE", "TO"];
    situacoes: Object[] = [{label: "Ativo", data: 'A'}, {label: "Inativo", data: 'I'}];
    submitted: boolean;
    submitedValidacaoCnpj: boolean;
    private _usuarioLogado: UsuarioLogado;
    private formularioValidaCnpj: FormGroup;
    private cnpjInvalido: boolean;
    private cnpjJaCadastrado: boolean;
    private abaCnpj: boolean;
    private abaGeral: boolean;
    private abaVendedores: boolean;
    private abaFornecedores: boolean;
    private abaFiliais: boolean;
    private isAlterar: boolean;
    private titulo: string;

    constructor(private _mercadoService: MercadoService,
                private _notificationService: NotificationService,
                private _alertService: AlertService,
                private _usuarioLogadoStorageService: UsuarioLogadoStorageService) {

        this.limparCampos();
    }
    ngOnInit() {
        this._usuarioLogado = this._usuarioLogadoStorageService.get();
    }
    
    limparCampos() {
        let dataAtual = new Date();
        this.formularioValidaCnpj = new FormGroup({
            cnpj: new FormControl('', Validators.required),
        });
        
        this.formulario = new FormGroup({
            id: new FormControl(-1),
            clienteSgs: new FormControl('', Validators.required),
            contato: new FormControl('', Validators.required),
            dataCadastro: new FormControl('' + dataAtual.getDate() + '/' + dataAtual.getMonth() + '/' + dataAtual.getFullYear()),
            nome: new FormControl('', Validators.required),
            cnpjClienteSG: new FormControl('', Validators.required),
            foneComercial: new FormControl('', Validators.required),
            situacao: new FormControl('A', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            endereco: new FormGroup({
                id: new FormControl(0),
                endereco: new FormControl(''),
                numero: new FormControl(''),
                cep: new FormControl(''),
                bairro: new FormControl(''),
                cidade: new FormControl('', Validators.required),
                uf: new FormControl('PR', Validators.required),
            }),
            trabalhaTresCasasDecimais: new FormControl(false, Validators.required),
        });
        
        this.cnpjJaCadastrado = false;
        this.cnpjInvalido = false;
        this.abaCnpj = true;
        this.abaGeral = false;
        this.abaVendedores = false;
        this.abaFornecedores = false;
        this.abaFiliais = false;
        this.isAlterar = false;
    }

    async verificarCnpj() {
        let cnpjValidoTmp = this.formularioValidaCnpj.value.cnpj && this.formularioValidaCnpj.value.cnpj != null && this.formularioValidaCnpj.value.cnpj != "" 
        ? PessoaUtil.validarCNPJ(this.formularioValidaCnpj.value.cnpj.match(/\d/g).join("")) : false;
        if(cnpjValidoTmp) {
            this.cnpjInvalido = false;
            let cnpj = this.formularioValidaCnpj.value.cnpj.match(/\d/g).join("");
            let res = await this._mercadoService.locateByCnpj(cnpj);
            if (res.data.body && res.data.body != null) {
                this.cnpjJaCadastrado = true;
                this.abaCnpj = true;
                this.abaGeral = false;
            }else{
                this.cnpjJaCadastrado = false;
                this.formulario.controls.cnpjClienteSG.setValue(cnpj);
                this.formularioValidaCnpj.value.cnpj = "";
                this.abaCnpj = false;
                this.abaGeral = true;
                this.ctdTabset.select('tabGeral');
            }
        } else {
            this.abaCnpj = true;
            this.abaGeral = false;
            this.cnpjInvalido = true;
            this.cnpjJaCadastrado = false;
        }
    }

    adicionar(mercado: Mercado) {
        this.limparCampos();
        this.titulo = "Cadastro de Mercado";
        this._mercado = mercado;
        this.modal.show();
    }

    editar(mercado: Mercado) {
        this.limparCampos();
        this.isAlterar = true;
        this.abaGeral = true;
        this.abaVendedores = true;
        this.abaFornecedores = true;
        this.abaFiliais = true;
        this.titulo = "Mercado: Editar Registro - CNPJ Cliente SG: " + mercado.cnpjClienteSG;
        this._mercado = mercado;
        this.formulario.patchValue(mercado);
        this.formulario.controls.trabalhaTresCasasDecimais.setValue(mercado.trabalhaTresCasasDecimais == "S");
        this.ctdTabset.select('tabGeral');
        this.modal.show();
    }

    async onSubmitFormulario() {
        try {
            this.submitted = true;
            let mercado = this.formulario.value as Mercado;
            let endereco = mercado.endereco as Endereco;
            let mercado_new = Object.assign(new Mercado(), mercado);
            mercado_new.trabalhaTresCasasDecimais = mercado.trabalhaTresCasasDecimais ? "S" : "N";
            mercado_new.endereco = Object.assign(new Endereco(), endereco);
            let filial = new Filial();
            filial.id = -1;
            filial.cnpj = mercado.cnpjClienteSG;
            filial.nome = mercado.nome;
            filial.endereco = Object.assign(new Endereco(), endereco);
            filial.foneComercial = mercado.foneComercial;
            filial.email = mercado.email;
            filial.contato = mercado.contato;
            filial.situacao = mercado.situacao;
            filial.dataCadastro = mercado.dataCadastro;
            filial.codFilial = 1;
            mercado_new.filial =  Object.assign(new Filial(), filial);
            if(this.formulario.valid) {
                let res = await this._mercadoService.saveOrUpdate(mercado_new);
                if (AmfUtil.validarResponse(res)) {
                    let mensagem = res.data.body;
                    if (mensagem == MensagemConst.MSGSAVEUPOK) {
                        if( mercado_new.id <= 0 ) {
                            mensagem = mensagem + + "<br><br>" + "Usuario padrão cadastrado:<br><br>" + "Login: " + mercado.cnpjClienteSG + "<br>" + "Senha: " + mercado.cnpjClienteSG;
                        }
                        this._notificationService.success(NotificationConst.TITLE_SUCCESS, mensagem);
                    } else {
                        this._notificationService.warning(NotificationConst.TITLE_WARNING, mensagem);
                    }
                }
                this.modal.hide();
                this.close.emit();
            }
        } catch (e) {
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }
}