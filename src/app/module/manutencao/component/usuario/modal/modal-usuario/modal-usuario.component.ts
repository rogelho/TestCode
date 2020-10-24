import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NotificationService} from "../../../../../../service/shared/notification.service";
import {UsuarioUtil} from "../../../../../../util/usuario-util";
import {Usuario} from "../../../../../../model/usuario/usuario";
import {PermUsuario} from "../../../../../../model/usuario/perm-usuario";
import {UsuarioService} from "../../../../../../service/usuario/usuario.service";
import {CadastraoService} from "../../../../../../service/cadastrao/cadastrao.service";
import {NotificationConst} from "../../../../../../const/shared/notification-const";
import {AlertService} from "../../../../../../service/shared/alert.service";
import {MensagemConst} from "../../../../../../const/shared/mensagem-const";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AmfUtil} from '../../../../../../util/amf-util';
import {UsuarioLogado} from "../../../../../../model/usuario/usuario-logado";
import {UsuarioLogadoStorageService} from "../../../../../../storage/usuario/usuario-logado-storage.service";

@Component({
    selector: 'app-modal-usuario',
    templateUrl: './modal-usuario.component.html',
    styleUrls: ['./modal-usuario.component.scss']
})
export class ModalUsuarioComponent implements OnInit {
    @ViewChild('modal') modal;
    @Output() close = new EventEmitter();
    private _usuario = UsuarioUtil.getInstance();
    private formulario: FormGroup;
    situacoes: Object[] = [{label: "Ativo", data: 'A'}, {label: "Inativo", data: 'I'}];
    pessoas: Usuario[];
    submitted: boolean;
    private _usuarioLogado: UsuarioLogado;
    private isAlterar: boolean;
    private titulo: string;

    constructor(private _usuarioService: UsuarioService,
        private _notificationService: NotificationService,
        private _alertService: AlertService,
        private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
        private _cadastraoService: CadastraoService) {

        this.limparCampos();
        this.titulo = "Cadastro de Usuario";
    }
    ngOnInit() {
        this._usuarioLogado = this._usuarioLogadoStorageService.get();
    }

    limparCampos() {
        this.formulario = new FormGroup({
            id: new FormControl(-1),
            nome: new FormControl('', Validators.required),
            login: new FormControl('', Validators.required),
            situacao: new FormControl('A', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            pessoa: new FormControl('', Validators.required),
            agrupaCotacao: new FormControl(false, Validators.required),
            ckMenuMercado: new FormControl(false, Validators.required),
            ckBuscarMercado: new FormControl(false, Validators.required),
            ckInserirMercado: new FormControl(false, Validators.required),
            ckAlterarMercado: new FormControl(false, Validators.required),
            ckExcluirMercado: new FormControl(false, Validators.required),
            ckMenuFornecedor: new FormControl(false, Validators.required),
            ckBuscarFornecedor: new FormControl(false, Validators.required),
            ckInserirFornecedor: new FormControl(false, Validators.required),
            ckAlterarFornecedor: new FormControl(false, Validators.required),
            ckExcluirFornecedor: new FormControl(false, Validators.required),
            ckMenuFilial: new FormControl(false, Validators.required),
            ckBuscarFilial: new FormControl(false, Validators.required),
            ckInserirFilial: new FormControl(false, Validators.required),
            ckAlterarFilial: new FormControl(false, Validators.required),
            ckExcluirFilial: new FormControl(false, Validators.required),
            ckMenuVendedor: new FormControl(false, Validators.required),
            ckBuscarVendedor: new FormControl(false, Validators.required),
            ckInserirVendedor: new FormControl(false, Validators.required),
            ckAlterarVendedor: new FormControl(false, Validators.required),
            ckExcluirVendedor: new FormControl(false, Validators.required),
            ckMenuUsuario: new FormControl(false, Validators.required),
            ckBuscarUsuario: new FormControl(false, Validators.required),
            ckInserirUsuario: new FormControl(false, Validators.required),
            ckAlterarUsuario: new FormControl(false, Validators.required),
            ckExcluirUsuario: new FormControl(false, Validators.required),
            ckListarCotacao: new FormControl(false, Validators.required),
            ckImprimirCotacao: new FormControl(false, Validators.required),
            ckAlterarCotacao: new FormControl(false, Validators.required),
            ckExcluirCotacao: new FormControl(false, Validators.required),
            ckFecharCotacao: new FormControl(false, Validators.required),
            ckReabrirCotacao: new FormControl(false, Validators.required),
            ckDigitarCotacao: new FormControl(false, Validators.required),
            ckListarPedido: new FormControl(false, Validators.required),
            ckImprimirPedido: new FormControl(false, Validators.required),
            ckExcluirPedido: new FormControl(false, Validators.required),
            ckListarPedidonaoGanho: new FormControl(false, Validators.required),
            ckAlterarSenha: new FormControl(false, Validators.required),
            ckAlterarSenhaUsuarios: new FormControl(false, Validators.required),
            ckLogOperacoes: new FormControl(false, Validators.required),
            ckParametros: new FormControl(false, Validators.required),
        });

        this.isAlterar = false;
    }

    async adicionar() {
        this.limparCampos();
        this.isAlterar = false;
        let res = await this._cadastraoService.listar();
        if (res.data.body) {
            this.pessoas = res.data.body.map(usuario => Object.assign(UsuarioUtil.getInstance(), usuario));
        }
        this._usuario = UsuarioUtil.getInstance();
        this._usuario.id = 0;
        this.modal.show();
    }

    editar(usuario: Usuario) {
        this.limparCampos();
        this.isAlterar = true;
        this._usuario = usuario;
        this.formulario.patchValue(usuario);
        this.formulario.controls.agrupaCotacao.setValue(this._usuario.agrupaCotacao == "S");
        this.pessoas = [];
        this.pessoas.push(this._usuario);
        this.formulario.controls.pessoa.setValue(this._usuario);
        this._usuario.permissoes.forEach(permissao => {
            if (permissao.rotina == "Mercado") {
                this.habilitaMercado((permissao.menu == "S"), (permissao.buscar == "S"), (permissao.inserir == "S"), (permissao.alterar == "S"), (permissao.excluir == "S"));
            } else if (permissao.rotina == "Fornecedor") {
                this.habilitaFornecedor((permissao.menu == "S"), (permissao.buscar == "S"), (permissao.inserir == "S"), (permissao.alterar == "S"), (permissao.excluir == "S"));
            } else if (permissao.rotina == "Filial") {
                this.habilitaFilial((permissao.menu == "S"), (permissao.buscar == "S"), (permissao.inserir == "S"), (permissao.alterar == "S"), (permissao.excluir == "S"));
            } else if (permissao.rotina == "Vendedor") {
                this.habilitaVendedor((permissao.menu == "S"), (permissao.buscar == "S"), (permissao.inserir == "S"), (permissao.alterar == "S"), (permissao.excluir == "S"));
            } else if (permissao.rotina == "Usuario") {
                this.habilitaUsuario((permissao.menu == "S"), (permissao.buscar == "S"), (permissao.inserir == "S"), (permissao.alterar == "S"), (permissao.excluir == "S"));
            } else if (permissao.rotina == "ListarCotacao") {
                this.formulario.controls.ckListarCotacao.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "ImprimirCotacao") {
                this.formulario.controls.ckImprimirCotacao.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "AlterarCotacao") {
                this.formulario.controls.ckAlterarCotacao.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "ExcluirCotacao") {
                this.formulario.controls.ckExcluirCotacao.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "FecharCotacao") {
                this.formulario.controls.ckFecharCotacao.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "ReabrirCotacao") {
                this.formulario.controls.ckReabrirCotacao.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "DigitarCotacao") {
                this.formulario.controls.ckDigitarCotacao.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "ListarPedido") {
                this.formulario.controls.ckListarPedido.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "ImprimirPedido") {
                this.formulario.controls.ckImprimirPedido.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "ExcluirPedido") {
                this.formulario.controls.ckExcluirPedido.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "ListarPedidonaoGanho") {
                this.formulario.controls.ckListarPedidonaoGanho.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "AlterarSenha") {
                this.formulario.controls.ckAlterarSenha.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "AlterarSenhaUsuarios") {
                this.formulario.controls.ckAlterarSenhaUsuarios.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "LogOperacoes") {
                this.formulario.controls.ckLogOperacoes.setValue(permissao.menu == "S");
            } else if (permissao.rotina == "Parametros") {
                this.formulario.controls.ckParametros.setValue(permissao.menu == "S");
            }
        });
        this.modal.show();
    }

    habilitaFuncoes() {
        let tipo = this.formulario.controls.pessoa.value.tipo;
        if (tipo == "ME") {
            this.habilitaMercado(true, true, false, true, false);
            this.habilitaFilial(true, true, true, true, true);
            this.habilitaFornecedor(true, true, true, true, true);
            this.habilitaVendedor(true, true, true, true, true);
            this.habilitaUsuario(true, true, true, true, true);
            this.habilitaCotacao(true, true, true, true, true, true, true);
            this.habilitaPedido(true, true, true);
            this.habilitaPedidonaoGanho(true);
            this.habilitaSenha(true, true);
            this.habilitaLog(true);
            this.habilitaParametros(false);
        } else if (tipo == "FI") {
            this.habilitaMercado(false, false, false, false, false);
            this.habilitaFilial(false, false, false, false, false);
            this.habilitaFornecedor(false, false, false, false, false);
            this.habilitaVendedor(false, false, false, false, false);
            this.habilitaUsuario(false, false, false, false, false);
            this.habilitaCotacao(true, true, true, true, true, true, true);
            this.habilitaPedido(true, true, false);
            this.habilitaPedidonaoGanho(true);
            this.habilitaSenha(true, false);
            this.habilitaLog(false);
            this.habilitaParametros(false);
        } else if (tipo == "FO") {
            this.habilitaMercado(false, false, false, false, false);
            this.habilitaFilial(false, false, false, false, false);
            this.habilitaFornecedor(true, true, false, true, false);
            this.habilitaVendedor(true, true, true, true, true);
            this.habilitaUsuario(true, true, true, true, true);
            this.habilitaCotacao(true, true, false, false, false, false, false);
            this.habilitaPedido(true, true, false);
            this.habilitaPedidonaoGanho(true);
            this.habilitaSenha(true, false);
            this.habilitaLog(false);
            this.habilitaParametros(false);
        } else if (tipo == "VE") {
            this.habilitaMercado(false, false, false, false, false);
            this.habilitaFilial(false, false, false, false, false);
            this.habilitaFornecedor(true, true, false, false, false);
            this.habilitaVendedor(true, true, false, true, false);
            this.habilitaUsuario(true, true, false, true, false);
            this.habilitaCotacao(true, false, false, false, false, false, true);
            this.habilitaPedido(true, true, false);
            this.habilitaPedidonaoGanho(true);
            this.habilitaSenha(true, false);
            this.habilitaLog(false);
            this.habilitaParametros(false);
        } else if (tipo == "AD") {
            this.habilitaMercado(true, true, true, true, true);
            this.habilitaFilial(true, true, true, true, true);
            this.habilitaFornecedor(true, true, true, true, true);
            this.habilitaVendedor(true, true, true, true, true);
            this.habilitaUsuario(true, true, true, true, true);
            this.habilitaCotacao(true, true, true, true, true, true, true);
            this.habilitaPedido(true, true, true);
            this.habilitaPedidonaoGanho(true);
            this.habilitaSenha(true, true);
            this.habilitaLog(true);
            this.habilitaParametros(true);
        }
    }

    habilitaMercado(Menu: Boolean, Busca: Boolean, Insere: Boolean, Altera: Boolean, Exclui: Boolean): void {
        this.formulario.controls.ckMenuMercado.setValue(Menu);
        this.formulario.controls.ckBuscarMercado.setValue(Busca);
        this.formulario.controls.ckInserirMercado.setValue(Insere);
        this.formulario.controls.ckAlterarMercado.setValue(Altera);
        this.formulario.controls.ckExcluirMercado.setValue(Exclui);
    }

    habilitaFilial(Menu: Boolean, Busca: Boolean, Insere: Boolean, Altera: Boolean, Exclui: Boolean): void {
        this.formulario.controls.ckMenuFilial.setValue(Menu);
        this.formulario.controls.ckBuscarFilial.setValue(Busca);
        this.formulario.controls.ckInserirFilial.setValue(Insere);
        this.formulario.controls.ckAlterarFilial.setValue(Altera);
        this.formulario.controls.ckExcluirFilial.setValue(Exclui);
    }

    habilitaFornecedor(Menu: Boolean, Busca: Boolean, Insere: Boolean, Altera: Boolean, Exclui: Boolean): void {
        this.formulario.controls.ckMenuFornecedor.setValue(Menu);
        this.formulario.controls.ckBuscarFornecedor.setValue(Busca);
        this.formulario.controls.ckInserirFornecedor.setValue(Insere);
        this.formulario.controls.ckAlterarFornecedor.setValue(Altera);
        this.formulario.controls.ckExcluirFornecedor.setValue(Exclui);
    }

    habilitaVendedor(Menu: Boolean, Busca: Boolean, Insere: Boolean, Altera: Boolean, Exclui: Boolean): void {
        this.formulario.controls.ckMenuVendedor.setValue(Menu);
        this.formulario.controls.ckBuscarVendedor.setValue(Busca);
        this.formulario.controls.ckInserirVendedor.setValue(Insere);
        this.formulario.controls.ckAlterarVendedor.setValue(Altera);
        this.formulario.controls.ckExcluirVendedor.setValue(Exclui);
    }

    habilitaUsuario(Menu: Boolean, Busca: Boolean, Insere: Boolean, Altera: Boolean, Exclui: Boolean): void {
        this.formulario.controls.ckMenuUsuario.setValue(Menu);
        this.formulario.controls.ckBuscarUsuario.setValue(Busca);
        this.formulario.controls.ckInserirUsuario.setValue(Insere);
        this.formulario.controls.ckAlterarUsuario.setValue(Altera);
        this.formulario.controls.ckExcluirUsuario.setValue(Exclui);
    }

    habilitaCotacao(Listar: Boolean, Imprimir: Boolean, Alterar: Boolean, Excluir: Boolean, Fechar: Boolean, Reabrir: Boolean, Digitar: Boolean): void {
        this.formulario.controls.ckListarCotacao.setValue(Listar);
        this.formulario.controls.ckImprimirCotacao.setValue(Imprimir);
        this.formulario.controls.ckAlterarCotacao.setValue(Alterar);
        this.formulario.controls.ckExcluirCotacao.setValue(Excluir);
        this.formulario.controls.ckFecharCotacao.setValue(Fechar);
        this.formulario.controls.ckReabrirCotacao.setValue(Reabrir);
        this.formulario.controls.ckDigitarCotacao.setValue(Digitar);
    }

    habilitaPedido(Listar: Boolean, Imprimir: Boolean, Excluir: Boolean): void {
        this.formulario.controls.ckListarPedido.setValue(Listar);
        this.formulario.controls.ckImprimirPedido.setValue(Imprimir);
        this.formulario.controls.ckExcluirPedido.setValue(Excluir);
    }

    habilitaPedidonaoGanho(Listar: Boolean): void {
        this.formulario.controls.ckListarPedidonaoGanho.setValue(Listar);
    }

    habilitaSenha(Individual: Boolean, Todos: Boolean): void {
        this.formulario.controls.ckAlterarSenha.setValue(Individual);
        this.formulario.controls.ckAlterarSenhaUsuarios.setValue(Todos);
    }

    habilitaLog(Listar: Boolean): void {
        this.formulario.controls.ckLogOperacoes.setValue(Listar);
    }

    habilitaParametros(Menu: Boolean): void {
        this.formulario.controls.ckParametros.setValue(Menu);
    }

    async onSubmitFormulario() {
        try {
            this.submitted = true;
            this.habilitaFuncoes();

            let usuario = this._usuario;
            usuario.login = this.formulario.value.login;
            usuario.nome = this.formulario.value.nome;
            usuario.email = this.formulario.value.email;
            usuario.situacao = this.formulario.value.situacao;
            usuario.agrupaCotacao = this.formulario.value.agrupaCotacao ? "S" : "N";
            if (!this.isAlterar) {
                usuario.senha = this.formulario.value.login;
                usuario.cadastrao = this.formulario.controls.pessoa.value.cadastrao;
                usuario.tipo = this.formulario.controls.pessoa.value.tipo;
            }

            let permissoes: PermUsuario[] = [];
            let permissao: PermUsuario;
            permissao = new PermUsuario();
            permissao.rotina = "Mercado";
            permissao.menu = (this.formulario.value.ckMenuMercado ? "S" : "N");
            permissao.buscar = (this.formulario.value.ckBuscarMercado ? "S" : "N");
            permissao.inserir = (this.formulario.value.ckInserirMercado ? "S" : "N");
            permissao.alterar = (this.formulario.value.ckAlterarMercado ? "S" : "N");
            permissao.excluir = (this.formulario.value.ckExcluirMercado ? "S" : "N");
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "Fornecedor";
            permissao.menu = (this.formulario.value.ckMenuFornecedor ? "S" : "N");
            permissao.buscar = (this.formulario.value.ckBuscarFornecedor ? "S" : "N");
            permissao.inserir = (this.formulario.value.ckInserirFornecedor ? "S" : "N");
            permissao.alterar = (this.formulario.value.ckAlterarFornecedor ? "S" : "N");
            permissao.excluir = (this.formulario.value.ckExcluirFornecedor ? "S" : "N");
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "Filial";
            permissao.menu = (this.formulario.value.ckMenuFilial ? "S" : "N");
            permissao.buscar = (this.formulario.value.ckBuscarFilial ? "S" : "N");
            permissao.inserir = (this.formulario.value.ckInserirFilial ? "S" : "N");
            permissao.alterar = (this.formulario.value.ckAlterarFilial ? "S" : "N");
            permissao.excluir = (this.formulario.value.ckExcluirFilial ? "S" : "N");
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "Vendedor";
            permissao.menu = (this.formulario.value.ckMenuVendedor ? "S" : "N");
            permissao.buscar = (this.formulario.value.ckBuscarVendedor ? "S" : "N");
            permissao.inserir = (this.formulario.value.ckInserirVendedor ? "S" : "N");
            permissao.alterar = (this.formulario.value.ckAlterarVendedor ? "S" : "N");
            permissao.excluir = (this.formulario.value.ckExcluirVendedor ? "S" : "N");
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "Usuario";
            permissao.menu = (this.formulario.value.ckMenuUsuario ? "S" : "N");
            permissao.buscar = (this.formulario.value.ckBuscarUsuario ? "S" : "N");
            permissao.inserir = (this.formulario.value.ckInserirUsuario ? "S" : "N");
            permissao.alterar = (this.formulario.value.ckAlterarUsuario ? "S" : "N");
            permissao.excluir = (this.formulario.value.ckExcluirUsuario ? "S" : "N");
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "ListarCotacao";
            permissao.menu = (this.formulario.value.ckListarCotacao ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "ImprimirCotacao";
            permissao.menu = (this.formulario.value.ckImprimirCotacao ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "AlterarCotacao";
            permissao.menu = (this.formulario.value.ckAlterarCotacao ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "ExcluirCotacao";
            permissao.menu = (this.formulario.value.ckExcluirCotacao ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "FecharCotacao";
            permissao.menu = (this.formulario.value.ckFecharCotacao ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "ReabrirCotacao";
            permissao.menu = (this.formulario.value.ckReabrirCotacao ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "DigitarCotacao";
            permissao.menu = (this.formulario.value.ckDigitarCotacao ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "ListarPedido";
            permissao.menu = (this.formulario.value.ckListarPedido ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "ListarPedidonaoGanho";
            permissao.menu = (this.formulario.value.ckListarPedidonaoGanho ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "ImprimirPedido";
            permissao.menu = (this.formulario.value.ckImprimirPedido ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "ExcluirPedido";
            permissao.menu = (this.formulario.value.ckExcluirPedido ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "AlterarSenha";
            permissao.menu = (this.formulario.value.ckAlterarSenha ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "AlterarSenhaUsuarios";
            permissao.menu = (this.formulario.value.ckAlterarSenhaUsuarios ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "LogOperacoes";
            permissao.menu = (this.formulario.value.ckLogOperacoes ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            permissao = new PermUsuario();
            permissao.rotina = "Parametros";
            permissao.menu = (this.formulario.value.ckParametros ? "S" : "N");
            permissao.buscar = "N";
            permissao.inserir = "N";
            permissao.alterar = "N";
            permissao.excluir = "N";
            permissoes.push(permissao);

            usuario.permissoes = permissoes;

            if (this.formulario.valid) {
                let res = await this._usuarioService.saveOrUpdate(usuario);
                if (AmfUtil.validarResponse(res)) {
                    let mensagem = res.data.body;
                    if (mensagem == MensagemConst.MSGSAVEUPOK) {
                        this._notificationService.success(NotificationConst.TITLE_SUCCESS, mensagem);
                    } else {
                        this._notificationService.warning(NotificationConst.TITLE_WARNING, mensagem);
                    }
                }
                this.modal.hide();
                this.close.emit();
            }
        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }
}