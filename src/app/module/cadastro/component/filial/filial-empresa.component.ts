import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {Filter} from "../../../../model/shared/filter";
import {Filial} from "../../../../model/filial/filial";
import {TableUtil} from "../../../../util/table-util";
import {UsuarioLogado} from "../../../../model/usuario/usuario-logado";
import {Page} from "../../../../model/shared/page";
import {UsuarioLogadoStorageService} from "../../../../storage/usuario/usuario-logado-storage.service";
import {NotificationService} from "../../../../service/shared/notification.service";
import {AlertService} from "../../../../service/shared/alert.service";
import {FilialService} from "../../../../service/filial/filial.service";
import {AmfUtil} from "../../../../util/amf-util";
import {TypeFilter} from "../../../../enum/shared/type-filter.enum";
import {UsuarioLogadoUtil} from "../../../../util/usuario-logado-util";
import {FilialUtil} from "../../../../util/filial-util";
import {MensagemConst} from "../../../../const/shared/mensagem-const";
import {NotificationConst} from "../../../../const/shared/notification-const";
import {ModalFilialEmpresaInserirAlterarComponent} from "./modal/modal-filial-empresa-inserir-alterar/modal-filial-empresa-inserir-alterar.component";


@Component({
    selector: 'app-filial-empresa',
    templateUrl: './filial-empresa.component.html',
    styleUrls: ['./filial-empresa.component.scss']
})
export class FilialEmpresaComponent implements OnInit {
    @Input() idMercado: number;
    @Input() isChildren = false;
    @ViewChild('myTable') table: any;
    @ViewChild('modalFilialEmpresaInserirAlterarComponent') modalFilialEmpresaInserirAlterarComponent: ModalFilialEmpresaInserirAlterarComponent;
    private _filters: Filter[];
    private _filtro: Filter;
    private _rowSelected: Filial[];
    private _tableConfig = TableUtil.getConfig();
    private _usuarioLogado: UsuarioLogado;
    private _page: Page;
    private _rows: Filial[];
    private _permissions;
    buscando: boolean;

    constructor(
        private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
        private _filialService: FilialService,
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
        this._rowSelected = new Array<Filial>();
        this._usuarioLogado = this._usuarioLogadoStorageService.get();
        this.loadFilters();
        this.loadPermission();
        this._page = TableUtil.getPageDefault();
        this.search();

    }

    private loadPermission() {
        this._permissions = {
            hasPermissionExcluirFilial: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Filial', 'excluir'),
            hasPermissionInserirFilial: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Filial', 'inserir'),
            hasPermissionBuscarFilial: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Filial', 'buscar'),
            hasPermissionMenuFilial: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Filial', 'menu'),
            hasPermissionAlterarFilial: UsuarioLogadoUtil.hasPermissionWithOperation(this._usuarioLogado.usuario.permissoes, 'Filial', 'alterar'),
        };
    }

    private loadFilters() {
        this._filters = this.getFilters();
        this._filtro = TableUtil.getFiltroSelecionado([]);
    }

    private getFilters(): Filter[] {
        let filters = new Array<Filter>();
        filters.push(new Filter(0, 'Nome', TypeFilter.LIKE, ['']));
        filters.push(new Filter(3, 'Código Filial', TypeFilter.BETWEEN, ['', '']));
        filters.push(new Filter(2, 'Cidade', TypeFilter.LIKE, ['']));
        return filters;

    }

    onFilter(filters: Filter[]) {
        // TODO por enquando somente está pegando um filtro, pois o back espera somente um, será alterado posteriormente... 07/05/2020
        this._rowSelected = new Array<Filial>();
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
        if (this._permissions.hasPermissionBuscarFilial) {
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
                    case TypeFilter.BETWEEN:
                        this.listar(this._filtro.id, this._page.numIni, this._page.numFim, [numIni, numFim, this._filtro.values[0], this._filtro.values[1]]);
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
        let res = await this._filialService.listar(filtro, numIni, numFim, params);
        if (AmfUtil.validarResponseList(res)) {
            this._rows = res.data.body.registros.map(row => Object.assign(FilialUtil.getInstance(), row));
            this._page = TableUtil.getPage(res.data.body.numReg, this._page.pagina, this._page.limit);
            this.buscando = false;
        }
    }

    onPage(pageInfo) {
        this._rowSelected = new Array<Filial>();
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
            let res = await this._filialService.locate(id);
        
        if (AmfUtil.validarResponse(res)) {
            let filial = Object.assign(FilialUtil.getInstance(), res.data.body);
            this.modalFilialEmpresaInserirAlterarComponent.open(filial);
        } else {
            this._alertService.message("** ATENÇÃO **", "Não foram encontrados Registros. Verifique!!");
        }
    }

    onExcluir(row) {
        this._alertService.question('Confirmação', 'Tem certeza que Deseja EXCLUIR Registro?', () => this.excluir(row.id));
    }

    private async excluir(idFilial) {
        try {
            let res = await this._filialService.excluir(idFilial);

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
        this.modalFilialEmpresaInserirAlterarComponent.open(FilialUtil.getInstance());
    }

    onCloseModal() {
        this.init();
    }

}
