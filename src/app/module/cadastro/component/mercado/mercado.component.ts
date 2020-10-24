import {Component, OnInit, ViewChild} from '@angular/core';
import {TableUtil} from "../../../../util/table-util";
import {MercadoService} from "../../../../service/mercado/mercado.service";
import {UsuarioLogadoStorageService} from "../../../../storage/usuario/usuario-logado-storage.service";
import {UsuarioLogado} from "../../../../model/usuario/usuario-logado";
import {Mercado} from "../../../../model/mercado/mercado";
import {NotificationService} from "../../../../service/shared/notification.service";
import {MercadoUtil} from "../../../../util/mercado-util";
import {Page} from "../../../../model/shared/page";
import {AmfUtil} from "../../../../util/amf-util";
import {Filter} from "../../../../model/shared/filter";
import {TypeFilter} from "../../../../enum/shared/type-filter.enum";
import {NotificationConst} from "../../../../const/shared/notification-const";
import {AlertService} from "../../../../service/shared/alert.service";
import {MensagemConst} from "../../../../const/shared/mensagem-const";
import {ModalMercadoComponent} from "./modal/modal-mercado/modal-mercado.component";

@Component({
    selector: 'app-mercado',
    templateUrl: './mercado.component.html',
    styleUrls: ['./mercado.component.scss']
})
export class MercadoComponent implements OnInit {

    @ViewChild('myTable') table: any;
    @ViewChild('modalMercado') modalMercado: ModalMercadoComponent;

    private _rows: Mercado[];
    private _tableConfig = TableUtil.getConfig();
    private _usuarioLogado: UsuarioLogado;
    private _rowSelected: Mercado[];
    private _page: Page;
    private _filters: Filter[];
    private _filtro: Filter;
    private _permissions;
    buscando: boolean;

    constructor(
        private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
        private _mercadoService: MercadoService,
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
        this._rowSelected = new Array<Mercado>();
        this._usuarioLogado = this._usuarioLogadoStorageService.get();
        this.loadFilters();
        this.loadPermission();
        this._page = TableUtil.getPageDefault();
        this.search();

    }

    private loadPermission() {
        let permissions = this._usuarioLogado.usuario.permissoes.find(item => item.rotina === "Mercado");
        this._permissions = {
            hasPermissionListarMercado: (permissions.buscar == "S"),
            hasPermissionInserirMercado: (permissions.inserir == "S"),
            hasPermissionAlterarMercado: (permissions.alterar == "S"),
            hasPermissionExcluirMercado: (permissions.excluir == "S")
        };
    }

    private loadFilters() {
        this._filters = this.getFilters();
        this._filtro = TableUtil.getFiltroSelecionado([]);
    }

    private getFilters(): Filter[] {
        let filters = new Array<Filter>();
        filters.push(new Filter(0, 'Nome', TypeFilter.LIKE, ['']));
        filters.push(new Filter(1, 'Código SGS', TypeFilter.BETWEEN, ['', '']));
        filters.push(new Filter(2, 'Cidade', TypeFilter.LIKE, ['']));
        return filters;
    }

    onFilter(filters: Filter[]) {
        // TODO por enquando somente está pegando um filtro, pois o back espera somente um, será alterado posteriormente... 07/05/2020
        this._rowSelected = new Array<Mercado>();
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
        let listagemDe = "0";
        let listagemAte = "999999";
        if (!this._usuarioLogado.isAdmin()){
            listagemDe = this._usuarioLogado.usuario.cadastrao.id.toString();
            listagemAte = this._usuarioLogado.usuario.cadastrao.id.toString();
        }
        if (this._filtro)
            switch (this._filtro.type) {
                case TypeFilter.BETWEEN:
                    this.listar(this._filtro.id, this._page.numIni, this._page.numFim, [listagemDe, listagemAte, this._filtro.values[0], this._filtro.values[1]]);
                    break;
                case TypeFilter.SELECT:
                    this.listar(this._filtro.id, this._page.numIni, this._page.numFim, [listagemDe, listagemAte, this._filtro.values[0]]);
                    break;
                case TypeFilter.LIKE:
                    this.listar(this._filtro.id, this._page.numIni, this._page.numFim, [listagemDe, listagemAte, this._filtro.values[0]]);
                    break;
                default:
                    this.listar(999999, this._page.numIni, this._page.numFim, [listagemDe, listagemAte]);
            }
    }

    async listar(filtro: number, numIni: number, numFim: number, params: string[] = [this._usuarioLogado.usuario.cadastrao.id.toString()]) {
        let res = await this._mercadoService.listar(filtro, numIni, numFim, params);
        if (AmfUtil.validarResponseList(res)) {
            this._rows = res.data.body.registros.map(row => Object.assign(MercadoUtil.getInstance(), row));
            this._page = TableUtil.getPage(res.data.body.numReg, this._page.pagina, this._page.limit);
            this.buscando = false;
        }
    }

    onPage(pageInfo) {
        this._rowSelected = new Array<Mercado>();
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

    async onAlterar(row: Mercado) {
        try {
            if (!this._permissions.hasPermissionAlterarMercado) {
                this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Usuário sem permissão.');
                return;
            }
            let res = await this._mercadoService.locate(row.id);
            if (AmfUtil.validarResponse(res))
                this.modalMercado.editar(Object.assign(MercadoUtil.getInstance(), res.data.body));
        } catch (e) {
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, this.getMensagemErro(e.message));
        }
    }

    onExcluir(row) {
        this._alertService.question('Confirmação', 'Deseja realmente excluir o mercado?', () => this.excluir(row.id));
    }

    private async excluir(id: number) {
        try {
            let res = await this._mercadoService.excluir(id);

            if (AmfUtil.validarResponse(res)) {
                let mensagem = res.data.body;
                if (mensagem == MensagemConst.MSGDELETEOK) {
                    this._notificationService.success(NotificationConst.TITLE_SUCCESS, mensagem);
                    this._rowSelected = new Array<Mercado>();
                    this.search();
                } else
                    this._notificationService.warning(NotificationConst.TITLE_WARNING, mensagem);
            }
        } catch (e) {
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, this.getMensagemErro(e.message));
        }
    }

    private getMensagemErro(mensagem) {
        let mensagemArray = mensagem.split(':');
        return mensagemArray.length > 1 ? mensagemArray[1] : mensagemArray[0];
    }

    onAdicionar() {
        this.modalMercado.adicionar(MercadoUtil.getInstance());
    }

    onCloseModal() {
        this.search();
    }

}
