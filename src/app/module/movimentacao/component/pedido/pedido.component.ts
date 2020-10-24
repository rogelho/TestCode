import {Component, OnInit, ViewChild} from '@angular/core';
import {UsuarioLogado} from "../../../../model/usuario/usuario-logado";
import {UsuarioLogadoStorageService} from "../../../../storage/usuario/usuario-logado-storage.service";
import {TypeFilter} from "../../../../enum/shared/type-filter.enum";
import {Filter} from "../../../../model/shared/filter";
import {TableUtil} from "../../../../util/table-util";
import {Page} from "../../../../model/shared/page";
import {AmfUtil} from "../../../../util/amf-util";
import {PedidoService} from "../../../../service/manutencao/pedido.service";
import {PedidoUtil} from "../../../../util/pedido-util";
import {Pedido} from "../../../../model/movimentacao/pedido";
import {NotificationConst} from "../../../../const/shared/notification-const";
import {NotificationService} from "../../../../service/shared/notification.service";
import {UsuarioLogadoUtil} from "../../../../util/usuario-logado-util";
import {RelatorioService} from "../../../../service/shared/relatorio.service";
import {AlertService} from "../../../../service/shared/alert.service";
import {Listagem} from "../../../../model/shared/listagem";
import {MensagemConst} from "../../../../const/shared/mensagem-const";

@Component({
    selector: 'app-pedido',
    templateUrl: './pedido.component.html',
    styleUrls: ['./pedido.component.scss']
})
export class PedidoComponent implements OnInit {
    @ViewChild('myTable') table: any;
    private _filters: Filter[];
    private _filtro: Filter;
    private _rowSelected: Pedido[];
    private _tableConfig = TableUtil.getConfig();
    private _usuarioLogado: UsuarioLogado;
    private _page: Page;
    private _rows: Pedido[];
    private _permissions;
    buscando: boolean;

    constructor(
        private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
        private _pedidoService: PedidoService,
        private _notificationService: NotificationService,
        private _relatorioService: RelatorioService,
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
        this._rowSelected = new Array<Pedido>();
        this._usuarioLogado = this._usuarioLogadoStorageService.get();
        this.loadFilters();
        this.loadPermission();
        this._page = TableUtil.getPageDefault();
        this.search();

    }

    private loadPermission() {
        this._permissions = {
            hasPermissionListarPedido: UsuarioLogadoUtil.hasPermission(this._usuarioLogado.usuario.permissoes, 'ListarPedido'),
            hasPermissionImprimirPedido: UsuarioLogadoUtil.hasPermission(this._usuarioLogado.usuario.permissoes, 'ImprimirPedido')

        };
    }

    private loadFilters() {
        this._filters = PedidoComponent.getFilters();
        this._filtro = TableUtil.getFiltroSelecionado([]);
    }

    private static getFilters(): Filter[] {
        let filters = new Array<Filter>();
        filters.push(new Filter(14, 'Nº da Cotação', TypeFilter.BETWEEN, ['', '']));
        filters.push(new Filter(5, 'Cnpj Fornecedor', TypeFilter.LIKE, [''], null, '00.000.000/0000-00', false));
        filters.push(new Filter(4, 'Nome Fornecedor', TypeFilter.LIKE, ['']));
        return filters;
    }

    onFilter(filters: Filter[]) {
        // TODO por enquando somente está pegando um filtro, pois o back espera somente um, será alterado posteriormente... 07/05/2020
        this._rowSelected = new Array<Pedido>();
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
        if (this._filtro)
            switch (this._filtro.type) {
                case TypeFilter.BETWEEN:
                    this.listar(this._filtro.id, this._page.numIni, this._page.numFim, [this._usuarioLogado.usuario.cadastrao.id.toString(), this._filtro.values[0], this._filtro.values[1]]);
                    break;
                case TypeFilter.SELECT:
                    this.listar(this._filtro.id, this._page.numIni, this._page.numFim, [this._usuarioLogado.usuario.cadastrao.id.toString(), this._filtro.values[0]]);
                    break;
                case TypeFilter.LIKE:
                    this.listar(this._filtro.id, this._page.numIni, this._page.numFim, [this._usuarioLogado.usuario.cadastrao.id.toString(), this._filtro.values[0]]);
                    break;
                default:
                    this.listar(this._filtro.id, this._page.numIni, this._page.numFim);
            }
    }

    async listar(filtro: number, numIni: number, numFim: number, params: string[] = [this._usuarioLogado.usuario.cadastrao.id.toString()]) {
        this.buscando = true;
        let res = await this._pedidoService.listar(filtro, numIni, numFim, params);
        if (AmfUtil.validarResponseList(res)) {
            this._rows = res.data.body.registros.map(row => Object.assign(PedidoUtil.getInstance(), row));
            this._page = TableUtil.getPage(res.data.body.numReg, this._page.pagina, this._page.limit);
            this.buscando = false;
        }
    }

    onPage(pageInfo) {
        this._rowSelected = new Array<Pedido>();
        this._page = TableUtil.getPage(this._page.numReg, pageInfo.offset, this._page.limit);
        this.search();
    }

    onSort(sortInfo) {
        try {
            let prop = sortInfo.sorts[0].prop;
            sortInfo.sorts[0].dir == 'asc'
                ? this._rows.sort((a: any, b: any) => a[prop].localeCompare(b[prop]))
                : this._rows.sort((a: any, b: any) => b[prop].localeCompare(a[prop]));
        }catch (e) {
            TableUtil.ordenar(this._rows, sortInfo.sorts[0]);
        }finally {
            this.table.offset = this._page.pagina;
        }
    }

    onGetMessages(): any {
        return TableUtil.getMessagesDefault();
    }

    onExcluir() {
        if (this.validRowSelected())
            this._alertService.question('Confirmação', 'Deseja realmente excluir as cotações?', () => this.excluir());
    }

    private async excluir() {
        try {
            let res = await this._pedidoService.excluirPedidos(new Listagem(this._rowSelected.length, this._rowSelected));

            if (AmfUtil.validarResponse(res)) {
                let mensagem = res.data.body;
                if (mensagem == MensagemConst.EXCLUIR_COTACAO) {
                    this._notificationService.success(NotificationConst.TITLE_SUCCESS, mensagem);
                    this._rowSelected = new Array<Pedido>();
                    this.search();
                } else
                    this._notificationService.warning(NotificationConst.TITLE_WARNING, mensagem);
            }
        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }

    onImprimir() {
        if (!this._permissions.hasPermissionImprimirPedido) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Usuário sem permissão.');
            return;
        }

        if (this.validRowSelected())
            this.imprimir();
    }

    private validRowSelected(): boolean {
        if (!this.isRowSelected()) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Não há nenhum registro selecionado.');
            return false;
        }
        return true;
    }

    private isRowSelected(): boolean {
        return !!this._rowSelected.length;
    }

    private imprimir() {
        this._relatorioService.openRCOT0002(this.getIdsCotacao(), this.getIdsFiliais(), this.getFornecedoresCotacao(), this._usuarioLogado.usuario.cadastrao.id);
    }

    private getIdsCotacao(): string[] {
        return this._rowSelected.map(c => c.cotacao.toString());
    }

    private getIdsFiliais(): string[] {
        return this._rowSelected.map(c => c.fkidfilial.toString());
    }

    private getFornecedoresCotacao(): string[] {
        return this._rowSelected.map(c => c.cnpjfornecedor.match(/\d/g).join(''));
    }
}
