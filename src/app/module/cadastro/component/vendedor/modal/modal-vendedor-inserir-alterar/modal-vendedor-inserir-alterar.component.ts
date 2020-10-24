import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NotificationService} from "../../../../../../service/shared/notification.service";
import {AlertService} from "../../../../../../service/shared/alert.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AmfUtil} from "../../../../../../util/amf-util";
import {UsuarioLogado} from "../../../../../../model/usuario/usuario-logado";
import {UsuarioLogadoStorageService} from "../../../../../../storage/usuario/usuario-logado-storage.service";
import {Mercado} from "../../../../../../model/mercado/mercado";
import {NotificationConst} from "../../../../../../const/shared/notification-const";
import {MensagemConst} from "../../../../../../const/shared/mensagem-const";
import {VendedorService} from "../../../../../../service/vendedor/vendedor.service";
import {VendedorUtil} from "../../../../../../util/vendedor-util";
import {Vendedor} from "../../../../../../model/mercado/vendedor";
import {Situacao} from "../../../../../../model/shared/situacao";
import {Fornecedor} from "../../../../../../model/mercado/fornecedor";
import {FornecedorService} from "../../../../../../service/fornecedor/fornecedor.service";
import {PedidoUtil} from "../../../../../../util/pedido-util";
import {Endereco} from "../../../../../../model/shared/endereco";
import {ModalFornecedorInserirAlterarComponent} from "../../../fornecedor/modal/modal-fornecedor-inserir-alterar/modal-fornecedor-inserir-alterar.component";
import {FornecedorUtil} from "../../../../../../util/fornecedor-util";
import {DateUtil} from "../../../../../../util/date-util";
import {ObjetoUtil} from "../../../../../../util/objeto-util";
import { PessoaUtil } from '../../../../../../util/pessoa-util';

@Component({
    selector: 'app-modal-vendedor-inserir-alterar',
    templateUrl: './modal-vendedor-inserir-alterar.component.html',
    styleUrls: ['./modal-vendedor-inserir-alterar.scss'],
})
export class ModalVendedorInserirAlterarComponent implements OnInit {
    @ViewChild('modal') modal;
    @Output() close = new EventEmitter();
    @ViewChild('modalFornecedorInserirAlterar') modalFornecedorInserirAlterar: ModalFornecedorInserirAlterarComponent;
    _usuarioLogado: UsuarioLogado;
    _vendedor = VendedorUtil.getInstance();
    cpfValido: boolean = false;
    formulario: FormGroup;
    estados: string[] = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "GO", "ES", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SP", "SC", "SE", "TO"];
    situacoes: Situacao[] = [{label: "Ativo", data: 'A'}, {label: "Inativo", data: 'I'}];
    fornecedores: Fornecedor[] = [];
    submitted: boolean;
    submitedValidacaoCpf: boolean;
    formularioValidaCpf: FormGroup;
    cpfValidado: boolean = false;
    fornecedor: Fornecedor = null;
    ocutarForncedor: boolean = false;

    constructor(private _vendedorService: VendedorService,
                private _fornecedorService: FornecedorService,
                private _notificationService: NotificationService,
                private _alertService: AlertService,
                private _usuarioLogadoStorageService: UsuarioLogadoStorageService) {

        this.formularioValidaCpf = new FormGroup({
            cpf: new FormControl('', Validators.required),
        });

        this.formulario = new FormGroup({
            id: new FormControl(0),
            cpf: new FormControl('', Validators.required),
            dataCadastro: new FormControl(''),
            nome: new FormControl('', Validators.required),
            situacao: new FormControl('A', Validators.required),
            fornecedor: new FormControl(null),
            foneComercial: new FormControl(''),
            foneResidencial: new FormControl(''),
            foneCelular: new FormControl(''),
            endereco: new FormGroup({
                    id: new FormControl(0),
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

    ngOnInit() {
    }

    async buscaCpf() {
        this.submitedValidacaoCpf = true;
        this.cpfValido = PessoaUtil.validarCpf(this.formularioValidaCpf.value.cpf.match(/\d/g).join(""));
        if (this.cpfValido) {
            let vendedor = new Vendedor();
            this.formulario.controls.cpf.setValue(this.formularioValidaCpf.value.cpf);
            let res = await this._vendedorService.locateByCpf(this.formularioValidaCpf.value.cpf);
            if (AmfUtil.validarResponse(res)) {
                let consultaFornVend = null;
                vendedor = Object.assign(VendedorUtil.getInstance(), res.data.body);
                if (this._usuarioLogado.isFornecedor()) {
                    consultaFornVend = await this._vendedorService.consultaFornVend(this._usuarioLogado.usuario.cadastrao as Fornecedor, vendedor);
                }
                if (this._usuarioLogado.isMercado() || this._usuarioLogado.isAdmin()) {
                    if (this.fornecedor != null) {
                        consultaFornVend = await this._vendedorService.consultaMercFornVend(this._usuarioLogado.usuario.cadastrao as Mercado, this.fornecedor, vendedor);
                    }
                }
                this.resultConsultaVendedor(consultaFornVend, vendedor);
            } else {
                this.resultConsultaVendedor(null, vendedor);
            }
        }
    }

    resultConsultaVendedor(result, vendedor: Vendedor) {
        if (result != null && AmfUtil.validarResponse(result)) {
            this._alertService.message("** Informação **", "Vendedor já cadastrado para este fornecedor!!!");
        } else {
            if (vendedor.id > 0) {
                vendedor = this.limparMascaraTelefone(vendedor);
                this.formulario.patchValue(vendedor);
            }
            this.cpfValidado = true;
        }
    }

    async listarFornecedores() {
        let numIni = this._usuarioLogado.usuario.cadastrao.id.toString();
        let numFim = this._usuarioLogado.usuario.cadastrao.id.toString();
        let res = await this._fornecedorService.listar(15, 0, 999999, [numIni, numFim]);
        if (AmfUtil.validarResponseList(res)) {
            this.fornecedores = res.data.body.registros.map(row => Object.assign(PedidoUtil.getInstance(), row));
        }
    }

    async open(vendedor: Vendedor) {
        await this.resetDados();
        this.ocutarForncedor = false;
        this._vendedor = vendedor;
        this._usuarioLogado = this._usuarioLogadoStorageService.get();
        this.setVendedor();
        this.formulario.patchValue(this._vendedor);
        if (this._usuarioLogado.isMercado() || this._usuarioLogado.isAdmin()) {
            this.listarFornecedores();
        } else if (this._usuarioLogado.isFornecedor()) {
            this.fornecedor = ObjetoUtil.novoObjetoSemReferencia(new Fornecedor(), this._usuarioLogado.usuario.cadastrao);
            this.fornecedor.endereco = ObjetoUtil.novoObjetoSemReferencia(new Endereco(), this._usuarioLogado.usuario.cadastrao.endereco);
            this.ocutarForncedor = true;
        }
        this.modal.show();
    }

    setVendedor() {
        if (this._vendedor.id > 0) {
            this.cpfValidado = true;
            this._vendedor = this.limparMascaraTelefone(this._vendedor);
            this.ocutarForncedor = true;
        } else {
            this._vendedor.dataCadastro = DateUtil.dataAtualFormatada();
            this._vendedor.situacao = 'A';
            this._vendedor.endereco.uf = 'PR';
        }
    }

    fechar() {
        this.resetDados();
        this.modal.hide();
    }

    resetDados() {
        this.formularioValidaCpf.reset();
        this.formulario.reset();
        this.cpfValidado = false;
        this.fornecedor = null;
    }

    async submitFormValid(mercado, fornecedor, vendedor) {
        let res = null;
        if (this.fornecedor != null && !(this._vendedor.id > 0)) {
            if (this._usuarioLogado.isMercado() || this._usuarioLogado.isAdmin()) {
                res = await this._vendedorService.SaveOrUpdate(mercado, fornecedor, vendedor);
            } else if (this._usuarioLogado.isFornecedor()) {
                res = await this._vendedorService.SaveOrUpdate(null, fornecedor, vendedor);
            }
        } else {
            if (this._usuarioLogado.isFornecedor()) {
                res = await this._vendedorService.SaveOrUpdateMercVend(mercado, vendedor);
            } else {
                res = await this._vendedorService.SaveOrUpdateVend(vendedor);
            }
        }
        if (AmfUtil.validarResponse(res)) {
            let mensagem = res.data.body;
            if (mensagem == MensagemConst.MSGSAVEUPOK) {
                this.modal.hide();
                this.close.emit();
                if (!(vendedor.id > 0)) {
                    mensagem = "Usuário padrão cadastrado:\n\n" + "Login: " + vendedor.cpf + "\n" + "Senha: " + vendedor.cpf + "\n";
                }
                this._notificationService.success(NotificationConst.TITLE_SUCCESS, mensagem);
            } else {
                this._notificationService.warning(NotificationConst.TITLE_WARNING, mensagem);
            }
        }
    }

    async onSubmitFormulario() {
        try {
            this.submitted = true;
            let mercado = this._usuarioLogado.usuario.cadastrao as Mercado;
            let vendedor = ObjetoUtil.novoObjetoSemReferencia(VendedorUtil.getInstance(), this.formulario.value);
            vendedor.endereco = ObjetoUtil.novoObjetoSemReferencia(new Endereco(), vendedor.endereco);
            this.formulario.controls['fornecedor'].setErrors(null);
            if (this.ocutarForncedor == false && this.formulario.controls['fornecedor'].value == null) {
                this.formulario.controls['fornecedor'].setErrors({'incorrect': true});
            }
            this.fornecedor = this.fornecedores.find(fornecedor => fornecedor.id == this.formulario.value.fornecedor);
            if (this._usuarioLogado.isMercado() || this._usuarioLogado.isAdmin()) {
                let resMercFornVend = await this._vendedorService.consultaMercFornVend(mercado, this.fornecedor, vendedor);
                if (AmfUtil.validarResponse(resMercFornVend)) {
                    this._alertService.message("** Informação **", "Vendedor já cadastrado para este fornecedor!!!");
                    this.formulario.controls['fornecedor'].setErrors({'incorrect': true});
                }
            }
            if (this.formulario.valid) {
                await this.submitFormValid(mercado, this.fornecedor, vendedor);
            }
        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, this.getMensagemErro(e.message));
        }
    }

    getMensagemErro(mensagem) {
        let mensagemArray = mensagem.split(':');
        return mensagemArray.length > 1 ? mensagemArray[1] : mensagemArray[0];
    }

    limparMascaraTelefone(vendedor: Vendedor) {
        let chaveObjetoVendedor = Object.keys(vendedor);
        chaveObjetoVendedor.forEach((chave) => {
            if (vendedor[chave] === "(__)____-____") {
                vendedor[chave] = "";
            }
        });
        return vendedor;
    }

    onAdicionarFornecedor() {
        this.modalFornecedorInserirAlterar.open(FornecedorUtil.getInstance());
    }
}
