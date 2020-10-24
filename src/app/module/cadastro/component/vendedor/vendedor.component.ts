import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {Filter} from "../../../../model/shared/filter";
import {TableUtil} from "../../../../util/table-util";
import {UsuarioLogado} from "../../../../model/usuario/usuario-logado";
import {Page} from "../../../../model/shared/page";
import {UsuarioLogadoStorageService} from "../../../../storage/usuario/usuario-logado-storage.service";
import {NotificationService} from "../../../../service/shared/notification.service";
import {AlertService} from "../../../../service/shared/alert.service";
import {UsuarioLogadoUtil} from "../../../../util/usuario-logado-util";
import {TypeFilter} from "../../../../enum/shared/type-filter.enum";
import {AmfUtil} from "../../../../util/amf-util";
import {PedidoUtil} from "../../../../util/pedido-util";
import {NotificationConst} from "../../../../const/shared/notification-const";
import {MensagemConst} from "../../../../const/shared/mensagem-const";
import {ModalVendedorInserirAlterarComponent} from "./modal/modal-vendedor-inserir-alterar/modal-vendedor-inserir-alterar.component";
import {Vendedor} from "../../../../model/mercado/vendedor";
import {VendedorService} from "../../../../service/vendedor/vendedor.service";
import {VendedorUtil} from "../../../../util/vendedor-util";

@Component({
    selector: 'app-vendedor',
    templateUrl: './vendedor.component.html',
    styleUrls: ['./vendedor.component.scss']
})
export class VendedorComponent implements OnInit {
    @Input() idFornecedor: number;
    @Input() isChildren = false;
    @ViewChild('myTable') table: any;
    @ViewChild('modalAlterar') modalInserirAlterar: ModalVendedorInserirAlterarComponent;
    _filters: Filter[];
    _filtro: Filter;
    _rowSelected: Vendedor[];
    _tableConfig = TableUtil.getConfig();
    _usuarioLogado: UsuarioLogado;
    _page: Page;
    _rows: Vendedor[];
    _permissions;
    buscando: boolean;

    constructor(
        private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
        private _vendedorService: VendedorService,
        private _notificationService: NotificationService,
        private _alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.init();
    }

    onFilialChange() {
        this.init();
    }

    private async init() {
        this._rowSelected = new Array<Vendedor>();
        this._usuarioLogado = this._usuarioLogadoStorageService.get();
        this.loadFilters();
        this.loadPermission();
        this._page = TableUtil.getPageDefault();
        this.search();

    }

    private loadPermission() {
        this._permissions = {
            hasPermissionExcluirVendedor: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Vendedor', 'excluir'),
            hasPermissionInserirVendedor: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Vendedor', 'inserir'),
            hasPermissionBuscarVendedor: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Vendedor', 'buscar'),
            hasPermissionMenuVendedor: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Vendedor', 'menu'),
            hasPermissionAlterarVendedor: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Vendedor', 'alterar'),
        };
    }

    private loadFilters() {
        this._filters = this.getFilters();
        this._filtro = TableUtil.getFiltroSelecionado([]);
    }

    private getFilters(): Filter[] {
        let filters = new Array<Filter>();
        filters.push(new Filter(6, 'Nome', TypeFilter.LIKE, ['']));
        return filters;
    }

    onFilter(filters: Filter[]) {
        // TODO por enquando somente está pegando um filtro, pois o back espera somente um, será alterado posteriormente... 07/05/2020
        this._rowSelected = new Array<Vendedor>();
        this._page = TableUtil.getPageDefault();
        this._filtro = TableUtil.getFiltroSelecionado(filters);
        this.search();
    }

    onRemoveFilter(filter: Filter) {
        //TODO por enquando não há opção de ter dois filtros, então sempre que excluído é consultado todos novamente...
        let fil = this._filters.find(f => f.id == filter.id);
        if (fil) fil.values = new Array<string>();
        this.init();
    }

    async search() {
        if (this._permissions.hasPermissionBuscarVendedor) {
            let numIni: string = '0';
            let numFim: string = '999999';

            if (!this._usuarioLogado.isAdmin()) {
                numIni = this._usuarioLogado.usuario.cadastrao.id.toString();
                numFim = this._usuarioLogado.usuario.cadastrao.id.toString();
            }
            if (this._filtro)
                switch (this._filtro.type) {
                    case TypeFilter.LIKE:
                        this.listar(this._filtro.id, this._page.numIni, this._page.numFim, [numIni, numFim, this._filtro.values[0]]);
                        break;
                    default:
                        this._filtro.id = 999999;
                        if (this.isChildren) {
                            if(this._usuarioLogado.isMercado() || this._usuarioLogado.isAdmin()) {
                                this.buscando = true;
                                let res = await this._vendedorService.listarMercFornVendByFornecedor(this.idFornecedor, this._usuarioLogado.usuario.cadastrao.id);
                                this.listarExternoResult(res);
                            } else if( this._usuarioLogado.isFornecedor()) {
                                this.buscando = true;
                                let res = await this._vendedorService.listarFornVendByFornecedor(this.idFornecedor);
                                this.listarExternoResult(res);
                            } else {
                                this._notificationService.error("** Atenção **" , "Tipo de usuário desconhecido: " + this._usuarioLogado.usuario.tipo);
                            }
                        }else{
                            this.listar(this._filtro.id, this._page.numIni, this._page.numFim, [numIni, numFim]);
                        }
                }
        } else {
            this._alertService.message("Aviso!", "Usuário sem permissão para listar informações")
        }

    }

    listarExternoResult(res) {
        if (AmfUtil.validarResponse(res)) {
            this._rows = res.data.body.map(row => Object.assign(VendedorUtil.getInstance(), row));
            this._page = TableUtil.getPage(this._rows.length, this._page.pagina, this._page.limit);
            this.buscando = false;
        }
    }

    async listar(filtro: number, numIni: number, numFim: number, params: string[] = [this._usuarioLogado.usuario.cadastrao.id.toString()]) {
        this.buscando = true;
        let res = await this._vendedorService.listar(filtro, numIni, numFim, params);
        if (AmfUtil.validarResponseList(res)) {
            this._rows = res.data.body.registros.map(row => Object.assign(PedidoUtil.getInstance(), row));
            this._page = TableUtil.getPage(res.data.body.numReg, this._page.pagina, this._page.limit);
            this.buscando = false;
        }
    }

    onPage(pageInfo) {
        this._rowSelected = new Array<Vendedor>();
        this._page = TableUtil.getPage(this._page.numReg, pageInfo.offset, this._page.limit);
        this.search();
    }

    onSort(sortInfo) {
        try {
            let prop = sortInfo.sorts[0].prop;
            sortInfo.sorts[0].dir == 'asc'
                ? this._rows.sort((a: any, b: any) => a[prop].localeCompare(b[prop]))
                : this._rows.sort((a: any, b: any) => b[prop].localeCompare(a[prop]));
        } catch (e) {
            TableUtil.ordenar(this._rows, sortInfo.sorts[0]);
        } finally {
            this.table.offset = this._page.pagina;
        }
    }

    onGetMessages(): any {
        return TableUtil.getMessagesDefault();
    }

    async onAlterar(id: number) {
        let res = this._usuarioLogado.isFornecedor() ?
            await this._vendedorService.locateByFornecedor(id, this._usuarioLogado.usuario.cadastrao.id):
            await this._vendedorService.locate(id);

        if (AmfUtil.validarResponse(res)) {
            let vendedor = res.data.body as Vendedor;
            this.modalInserirAlterar.open(vendedor);
        } else {
            this._alertService.message("** ATENÇÃO **", "Não foram encontrados Registros. Verifique!!");
        }

    }

    onExcluir(row) {
        this._alertService.question('Confirmação', 'Tem certeza que Deseja EXCLUIR Registro?', () => this.excluir(row.id));
    }

    private async excluir(idVendedor) {
        try {
            let funcao = this._usuarioLogado.isFornecedor() ?
                "ExcluirFornVend" :
                ( this._usuarioLogado.isMercado() || this._usuarioLogado.isAdmin())
                ? "ExcluirMercFornVend"
                : "";
                let res = await this._vendedorService.excluirVendedor(funcao, this._usuarioLogado.usuario.cadastrao.id.toString(), idVendedor);

            if (AmfUtil.validarResponse(res)) {
                let mensagem = res.data.body;
                if (mensagem == MensagemConst.MSGDELETEOK) {
                    this._notificationService.success(NotificationConst.TITLE_SUCCESS, mensagem);
                    this.search();
                } else {
                    this._notificationService.warning(NotificationConst.TITLE_WARNING, mensagem);
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

    onAdicionar() {
        this.modalInserirAlterar.open(VendedorUtil.getInstance());
    }

    onCloseModal() {
        this.init();
    }

}
