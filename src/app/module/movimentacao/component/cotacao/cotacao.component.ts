import {Component, OnInit, ViewChild} from '@angular/core';
import {TableUtil} from "../../../../util/table-util";
import {CotacaoService} from "../../../../service/manutencao/cotacao.service";
import {UsuarioLogadoStorageService} from "../../../../storage/usuario/usuario-logado-storage.service";
import {UsuarioLogado} from "../../../../model/usuario/usuario-logado";
import {Cotacao} from "../../../../model/movimentacao/cotacao";
import {NotificationService} from "../../../../service/shared/notification.service";
import {CotacaoUtil} from "../../../../util/cotacao-util";
import {Page} from "../../../../model/shared/page";
import {AmfUtil} from "../../../../util/amf-util";
import {Filter} from "../../../../model/shared/filter";
import {TypeFilter} from "../../../../enum/shared/type-filter.enum";
import {Option} from "../../../../model/shared/option";
import {ModalCotacaoAlterarComponent} from "./modal/modal-cotacao-alterar/modal-cotacao-alterar.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationConst} from "../../../../const/shared/notification-const";
import {ModalCotacaoVisualizarComponent} from "./modal/modal-cotacao-visualizar/modal-cotacao-visualizar.component";
import {AlertService} from "../../../../service/shared/alert.service";
import {MensagemConst} from "../../../../const/shared/mensagem-const";
import {ModalCotacaoManutencaoPrePedidoComponent} from "./modal/modal-cotacao-manutencao-pre-pedido/modal-cotacao-manutencao-pre-pedido.component";
import {Listagem} from "../../../../model/shared/listagem";
import {RelatorioService} from "../../../../service/shared/relatorio.service";
import {UsuarioLogadoUtil} from "../../../../util/usuario-logado-util";

@Component({
    selector: 'app-cotacao',
    templateUrl: './cotacao.component.html',
    styleUrls: ['./cotacao.component.scss']
})
export class CotacaoComponent implements OnInit {

    @ViewChild('myTable') table: any;
    @ViewChild('modalAlterar') modalAlterar: ModalCotacaoAlterarComponent;
    @ViewChild('modalVisualizar') modalVisualizar: ModalCotacaoVisualizarComponent;
    @ViewChild('modalManutencaoPrePedido') modalManutencaoPrePedido: ModalCotacaoManutencaoPrePedidoComponent;

    private _rows: Cotacao[];
    private _tableConfig = TableUtil.getConfig();
    private _usuarioLogado: UsuarioLogado;
    private _rowSelected: Cotacao[];
    private _page: Page;
    private _filters: Filter[];
    private _filtro: Filter;
    private _permissions;

    constructor(private _cotacaoService: CotacaoService,
                private _notificationService: NotificationService,
                private _alertService: AlertService,
                private _relatorioService: RelatorioService,
                private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
                private _ngbModal: NgbModal) {
    }

    ngOnInit() {
        this.init();
    }

    onFilialChange(id) {
        this.init();
    }

    onGetMessages(): any {
        return TableUtil.getMessagesDefault();
    }

    onPage(pageInfo) {
        this._rowSelected = new Array<Cotacao>();
        this._page = TableUtil.getPage(this._page.numReg, pageInfo.offset, this._page.limit);
        this.search();
    }

    onFilter(filters: Filter[]) {
        // TODO por enquando somente está pegando um filtro, pois o back espera somente um, será alterado posteriormente... 07/05/2020
        this._rowSelected = new Array<Cotacao>();
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

    onSort(sortInfo) {
        //TODO Tornar generico quando for 'fornecedor.nome'...
        if (sortInfo.sorts[0].prop == 'fornecedor.nome') {
            sortInfo.sorts[0].dir == 'asc'
                ? this._rows.sort((a: any, b: any) => a.fornecedor.nome.localeCompare(b.fornecedor.nome))
                : this._rows.sort((a: any, b: any) => b.fornecedor.nome.localeCompare(a.fornecedor.nome));
        } else
            TableUtil.ordenar(this._rows, sortInfo.sorts[0]);

        this.table.offset = this._page.pagina;
    }

    onToggleExpandRow(row) {
        this.table.rowDetail.toggleExpandRow(row);
    }

    onGetNomeMercado(cotacao: Cotacao): string {
        return `${cotacao.mercado.clienteSgs} - ${cotacao.mercado.nome}`
    }

    onCloseModal() {
        this.search();
    }

    async onAlterar(row: Cotacao) {
        try {
            if (!this._permissions.hasPermissionAlterarCotacao) {
                this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Usuário sem permissão.');
                return;
            }

            let res = this._usuarioLogado.isAgrupaCotacao()
                ? await this._cotacaoService.locateAgrupado({cotacoes: row.idCotacaoAgrupado})
                : await this._cotacaoService.locate(row.id);

            if (AmfUtil.validarResponse(res))
                this.modalAlterar.open(Object.assign(CotacaoUtil.getInstance(), res.data.body));

        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }

    async onVisualizar(row: Cotacao) {
        try {
            if (!this._permissions.hasPermissionDigitarCotacao) {
                this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Usuário sem permissão.');
                return;
            }

            let res = this._usuarioLogado.isAgrupaCotacao()
                ? await this._cotacaoService.locateAgrupado({cotacoes: row.idCotacaoAgrupado})
                : await this._cotacaoService.locate(row.id);

            if (AmfUtil.validarResponse(res))
                this.modalVisualizar.open(Object.assign(CotacaoUtil.getInstance(), res.data.body));

        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }

    onPrePedido(row: Cotacao) {
        if (row.isGerado()) {
            this._alertService.question(`Pré-Pedido para a cotação ${row.cotacao} já foi gerado.`
                , 'Qualquer alteração na manutenção do pedido será perdida. Deseja continuar?'
                , () => this.gerarPrePedido(row));
            return;
        }
        this.gerarPrePedido(row);
    }

    async onManutencaoPrePedido(row: Cotacao) {
        try {
            // TODO será continuado quando P.O encontrar alguém que consiga mostrar para nós como funciona...
            if (this._usuarioLogado.isAgrupaCotacao()) {
                let res = await this._cotacaoService.locateAgrupado({cotacoes: row.idCotacaoAgrupado});
                if (AmfUtil.validarResponse(res))
                    this.modalManutencaoPrePedido.open(Object.assign(CotacaoUtil.getInstance(), res.data.body));
            }
        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }

    onExcluir() {
        if (!this._permissions.hasPermissionExcluirCotacao) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Usuário sem permissão.');
            return;
        }

        if (this.validRowSelected())
            this._alertService.question('Confirmação', 'Deseja realmente excluir as cotações?', () => this.excluir());
    }

    onFechar() {
        if (!this._permissions.hasPermissionFecharCotacao) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Usuário sem permissão.');
            return;
        }

        if (this.validRowSelected())
            this._alertService.question('Confirmação', 'Deseja realmente fechar as cotações?', () => this.fechar());
    }

    onReabrir() {
        if (!this._permissions.hasPermissionReabrirCotacao) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Usuário sem permissão.');
            return;
        }

        if (this.validRowSelected())
            this._alertService.question('Confirmação', 'Deseja realmente reabrir as cotações?', () => this.reabrir());
    }

    onImprimir() {
        if (!this._permissions.hasPermissionImprimirCotacao) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Usuário sem permissão.');
            return;
        }

        if (this.validRowSelected())
            this.imprimir();
    }

    onDoPrePedido(row: Cotacao): boolean {
        return this._usuarioLogado.isAgrupaCotacaoAndIsGrupoAdmin() && !row.existePedido && row.isFechado();
    }

    onDoVisualizar(row: Cotacao): boolean {
        return !row.isFechado();
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
                default:
                    this.listar(this._filtro.id, this._page.numIni, this._page.numFim);
            }
    }

    async listar(filtro: number, numIni: number, numFim: number, params: string[] = [this._usuarioLogado.usuario.cadastrao.id.toString()]) {
        let res = await this._cotacaoService.listar(filtro, numIni, numFim, params);

        if (AmfUtil.validarResponseList(res)) {
            this._rows = res.data.body.registros.map(row => Object.assign(CotacaoUtil.getInstance(), row));
            this._page = TableUtil.getPage(res.data.body.numReg, this._page.pagina, this._page.limit);
        }
    }

    private async init() {
        this._rowSelected = new Array<Cotacao>();
        this._usuarioLogado = this._usuarioLogadoStorageService.get();
        this.loadFilters();
        this.loadPermission();
        this._page = TableUtil.getPageDefault();
        this.search();
    }

    private loadFilters() {
        this._filters = this.getFilters();
        this._filtro = TableUtil.getFiltroSelecionado([]);
    }

    private loadPermission() {
        this._permissions = {
            hasPermissionListarCotacao: UsuarioLogadoUtil.hasPermission(this._usuarioLogado.usuario.permissoes, 'ListarCotacao'),
            hasPermissionImprimirCotacao: UsuarioLogadoUtil.hasPermission(this._usuarioLogado.usuario.permissoes, 'ImprimirCotacao'),
            hasPermissionAlterarCotacao: UsuarioLogadoUtil.hasPermission(this._usuarioLogado.usuario.permissoes, 'AlterarCotacao'),
            hasPermissionExcluirCotacao: UsuarioLogadoUtil.hasPermission(this._usuarioLogado.usuario.permissoes, 'ExcluirCotacao'),
            hasPermissionFecharCotacao: UsuarioLogadoUtil.hasPermission(this._usuarioLogado.usuario.permissoes, 'FecharCotacao'),
            hasPermissionReabrirCotacao: UsuarioLogadoUtil.hasPermission(this._usuarioLogado.usuario.permissoes, 'ReabrirCotacao'),
            hasPermissionDigitarCotacao: UsuarioLogadoUtil.hasPermission(this._usuarioLogado.usuario.permissoes, 'DigitarCotacao'),
        };
    }

    private async gerarPrePedido(cotacao: Cotacao) {
        try {
            let res = await this._cotacaoService.gerarPrePedido(cotacao);

            if (AmfUtil.validarResponse(res)) {
                let mensagem = res.data.body;
                if (mensagem == MensagemConst.GERACAO_PRE_PEDIDO) {
                    this._notificationService.success(NotificationConst.TITLE_SUCCESS, mensagem);
                    this.search();
                } else
                    this._notificationService.warning(NotificationConst.TITLE_WARNING, mensagem);
            }
        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }

    private isRowSelected(): boolean {
        return !!this._rowSelected.length;
    }

    private validRowSelected(): boolean {
        if (!this.isRowSelected()) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Não há nenhum registro selecionado.');
            return false;
        }
        return true;
    }

    private async excluir() {
        try {
            let res = await this._cotacaoService.excluirCotacoes(new Listagem(this._rowSelected.length, this._rowSelected));

            if (AmfUtil.validarResponse(res)) {
                let mensagem = res.data.body;
                if (mensagem == MensagemConst.EXCLUIR_COTACAO) {
                    this._notificationService.success(NotificationConst.TITLE_SUCCESS, mensagem);
                    this._rowSelected = new Array<Cotacao>();
                    this.search();
                } else
                    this._notificationService.warning(NotificationConst.TITLE_WARNING, mensagem);
            }

        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }

    private async fechar() {
        try {
            if (!this.validParaFechar())
                return;

            let res = await this._cotacaoService.fechar(new Listagem(this._rowSelected.length, this._rowSelected));

            if (AmfUtil.validarResponse(res)) {
                let mensagem = res.data.body;
                if (mensagem == MensagemConst.FECHAR_COTACAO) {
                    this._notificationService.success(NotificationConst.TITLE_SUCCESS, mensagem);
                    this._rowSelected = new Array<Cotacao>();
                    this.search();
                } else
                    this._notificationService.warning(NotificationConst.TITLE_WARNING, mensagem);
            }

        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }

    private async reabrir() {
        try {
            if (!this.validParaReabrir())
                return;

            let res = await this._cotacaoService.reabrir(new Listagem(this._rowSelected.length, this._rowSelected));

            if (AmfUtil.validarResponse(res)) {
                let mensagem = res.data.body;
                if (mensagem == MensagemConst.REABRIR_COTACAO) {
                    this._notificationService.success(NotificationConst.TITLE_SUCCESS, mensagem);
                    this._rowSelected = new Array<Cotacao>();
                    this.search();
                } else
                    this._notificationService.warning(NotificationConst.TITLE_WARNING, mensagem);
            }

        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, e.message);
        }
    }

    private imprimir() {
        this._relatorioService.openRCOT0003(this.getIdsCotacao(), this.getFornecedoresCotacao(), this._usuarioLogado.usuario.cadastrao.id);
    }

    private getIdsCotacao(): string[] {
        return this._rowSelected.map(c => this._usuarioLogado.isAgrupaCotacao() ? c.idCotacaoAgrupado : c.id.toString());
    }

    private getFornecedoresCotacao(): string[] {
        return this._rowSelected.map(c => this._usuarioLogado.isAgrupaCotacao() ? c.cnpjFornecedorAgrupado.match(/\d/g).join('') : c.cnpjFornecedor.match(/\d/g).join(''));
    }

    private validParaFechar(): boolean {
        if (this.contemCotacoesFechadas()) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Há cotações fechadas selecionadas.');
            return false;
        }
        if (this.contemCotacoesEncerradas()) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Há cotações encerradas selecionadas.');
            return false;
        }
        return true;
    }

    private validParaReabrir(): boolean {
        if (this.contemCotacoesAbertasOuComPedido()) {
            this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Há cotações abertas ou que possuem pedidos selecionadas.');
            return false;
        }

        return true;
    }

    private contemCotacoesFechadas(): boolean {
        return !!this._rowSelected.find(c => c.isFechadoPor());
    }

    private contemCotacoesEncerradas(): boolean {
        return !!this._rowSelected.find(c => c.isEncerrado());
    }

    private contemCotacoesAbertasOuComPedido(): boolean {
        return !!this._rowSelected.find(c => !c.isFechado() || c.existePedido);
    }

    private getFilters(): Filter[] {
        let filters = new Array<Filter>();
        filters.push(new Filter(14, 'Nº da Cotação', TypeFilter.BETWEEN, ['', '']));
        filters.push(new Filter(13, 'Status', TypeFilter.SELECT, [''], this.getOptions()));
        return filters;
    }

    private getOptions(): Option[] {
        let options = new Array<Option>();
        options.push(new Option('Aberto', 'A'));
        options.push(new Option('Fechado', 'F'));
        options.push(new Option('Encerrado', 'E'));
        if (this._usuarioLogado.isAgrupaCotacaoAndIsGrupoAdmin()) options.push(new Option('Gerado', 'G'));
        return options;
    }

}
