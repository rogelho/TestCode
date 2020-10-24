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
import {Fornecedor} from "../../../../model/mercado/fornecedor";
import {FornecedorService} from "../../../../service/fornecedor/fornecedor.service";
import {MensagemConst} from "../../../../const/shared/mensagem-const";
import {ModalFornecedorInserirAlterarComponent} from "./modal/modal-fornecedor-inserir-alterar/modal-fornecedor-inserir-alterar.component";
import {FornecedorUtil} from "../../../../util/fornecedor-util";

@Component({
    selector: 'app-fornecedor',
    templateUrl: './fornecedor.component.html',
    styleUrls: ['./fornecedor.component.scss']
})

export class FornecedorComponent implements OnInit {
    @Input() idMercado: number;
    @Input() isChildren = false;
    @ViewChild('myTable') table: any;
    @ViewChild('modalAlterar') modalInserirAlterar: ModalFornecedorInserirAlterarComponent;
    private _filters: Filter[];
    private _filtro: Filter;
    private _rowSelected: Fornecedor[];
    private _tableConfig = TableUtil.getConfig();
    private _usuarioLogado: UsuarioLogado;
    private _page: Page;
    private _rows: Fornecedor[];
    private _permissions;
    buscando: boolean;

    constructor(
        private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
        private _fornecedorService: FornecedorService,
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
        this._rowSelected = new Array<Fornecedor>();
        this._usuarioLogado = this._usuarioLogadoStorageService.get();
        this.loadFilters();
        this.loadPermission();
        this._page = TableUtil.getPageDefault();
        this.search();
    }

    private loadPermission() {
        this._permissions = {
            hasPermissionExcluirFornecedor: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Vendedor', 'excluir'),
            hasPermissionInserirFornecedor: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Vendedor', 'inserir'),
            hasPermissionBuscarFornecedor: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Vendedor', 'buscar'),
            hasPermissionMenuFornecedor: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Vendedor', 'menu'),
            hasPermissionAlterarFornecedor: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Vendedor', 'alterar'),
        };
    }

    private loadFilters() {
        this._filters = this.getFilters();
        this._filtro = TableUtil.getFiltroSelecionado([]);
    }

    private getFilters(): Filter[] {
        let filters = new Array<Filter>();
        filters.push(new Filter(0, 'Razão Social', TypeFilter.LIKE, ['']));
        filters.push(new Filter(4, 'Nome Fantasia', TypeFilter.LIKE, ['']));
        filters.push(new Filter(5, 'Cnpj', TypeFilter.LIKE, [''], null, '00.000.000/0000-00', false));
        return filters;
    }

    onFilter(filters: Filter[]) {
        // TODO por enquando somente está pegando um filtro, pois o back espera somente um, será alterado posteriormente... 07/05/2020
        this._rowSelected = new Array<Fornecedor>();
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

    search() {
        if (this._permissions.hasPermissionBuscarFornecedor) {
            let numIni: string = '0';
            let numFim: string = '999999';

            if (this._usuarioLogado.usuario.tipo != 'AD') {
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
                            numIni = this.idMercado.toString();
                            numFim = this.idMercado.toString(); 
                        }
                        this.listar(this._filtro.id, this._page.numIni, this._page.numFim, [numIni, numFim]);
                }
        } else {
            this._alertService.message("Aviso!", "Usuário sem permissão para listar informações")
        }

    }

    async listar(filtro: number, numIni: number, numFim: number, params: string[] = [this._usuarioLogado.usuario.cadastrao.id.toString()]) {
        this.buscando = true;
        let res = await this._fornecedorService.listar(filtro, numIni, numFim, params);
        if (AmfUtil.validarResponseList(res)) {
            this._rows = res.data.body.registros.map(row => Object.assign(PedidoUtil.getInstance(), row));
            this._page = TableUtil.getPage(res.data.body.numReg, this._page.pagina, this._page.limit);
            this.buscando = false;
        }
    }

    onPage(pageInfo) {
        this._rowSelected = new Array<Fornecedor>();
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
        let res;
        if (this._usuarioLogado.usuario.tipo != "ME") {
            res = await this._fornecedorService.locate(id);
        } else {
            res = await this._fornecedorService.locateByMercado(this._usuarioLogado.usuario.cadastrao.id, id);
        }
        if (AmfUtil.validarResponse(res)) {
            let fornecedor = res.data.body as Fornecedor;
            this.modalInserirAlterar.open(fornecedor);
        }else{
            this._alertService.message("** ATENÇÃO **", "Não foram encontrados Registros. Verifique!!");
        }

    }

    onExcluir(row) {
        this._alertService.question('Confirmação', 'Deseja realmente excluir as cotações?', () => this.excluir(row.id));
    }

    private async excluir(idFornecedor) {
        try {
            let res = await this._fornecedorService.excluirFornecedor(this._usuarioLogado.usuario.cadastrao.id.toString(), idFornecedor);

            if (AmfUtil.validarResponse(res)) {
                let mensagem = res.data.body;
                if (mensagem == MensagemConst.EXCLUIR_FORNECEDOR) {
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
        this.modalInserirAlterar.open(FornecedorUtil.getInstance());
    }

}
