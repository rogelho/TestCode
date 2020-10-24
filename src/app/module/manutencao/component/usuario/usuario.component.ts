import {Component, OnInit, ViewChild} from '@angular/core';
import {TableUtil} from "../../../../util/table-util";
import {UsuarioService} from "../../../../service/usuario/usuario.service";
import {UsuarioLogadoStorageService} from "../../../../storage/usuario/usuario-logado-storage.service";
import {UsuarioLogado} from "../../../../model/usuario/usuario-logado";
import {Usuario} from "../../../../model/usuario/usuario";
import {NotificationService} from "../../../../service/shared/notification.service";
import {UsuarioUtil} from "../../../../util/usuario-util";
import {Page} from "../../../../model/shared/page";
import {AmfUtil} from "../../../../util/amf-util";
import {Filter} from "../../../../model/shared/filter";
import {TypeFilter} from "../../../../enum/shared/type-filter.enum";
import {NotificationConst} from "../../../../const/shared/notification-const";
import {AlertService} from "../../../../service/shared/alert.service";
import {MensagemConst} from "../../../../const/shared/mensagem-const";
import {ModalUsuarioComponent} from "./modal/modal-usuario/modal-usuario.component";

@Component({
    selector: 'app-usuario',
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

    @ViewChild('myTable') table: any;
    @ViewChild('modalUsuario') modalUsuario: ModalUsuarioComponent;

    private _rows: Usuario[];
    private _tableConfig = TableUtil.getConfig();
    private _usuarioLogado: UsuarioLogado;
    private _rowSelected: Usuario[];
    private _page: Page;
    private _filters: Filter[];
    private _filtro: Filter;
    private _permissions;
    buscando: boolean;

    constructor(
        private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
        private _usuarioService: UsuarioService,
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
        this._rowSelected = new Array<Usuario>();
        this._usuarioLogado = this._usuarioLogadoStorageService.get();
        this.loadFilters();
        this.loadPermission();
        this._page = TableUtil.getPageDefault();
        this.search();

    }

    private loadPermission() {
        let permissions = this._usuarioLogado.usuario.permissoes.find(item => item.rotina === "Usuario");
        this._permissions = {
            hasPermissionListarUsuario: (permissions.buscar == "S"),
            hasPermissionInserirUsuario: (permissions.inserir == "S"),
            hasPermissionAlterarUsuario: (permissions.alterar == "S"),
            hasPermissionExcluirUsuario: (permissions.excluir == "S")
        };
    }

    private loadFilters() {
        this._filters = this.getFilters();
        this._filtro = TableUtil.getFiltroSelecionado([]);
    }

    private getFilters(): Filter[] {
        let filters = new Array<Filter>();
        filters.push(new Filter(6, 'Nome', TypeFilter.LIKE, ['']));
        filters.push(new Filter(7, 'Login', TypeFilter.LIKE, ['']));
        return filters;
    }

    onFilter(filters: Filter[]) {
        this._rowSelected = new Array<Usuario>();
        this._page = TableUtil.getPageDefault();
        this._filtro = TableUtil.getFiltroSelecionado(filters);
        this.search();
    }

    onRemoveFilter(filter: Filter) {
        let fil = this._filters.find(f => f.id == filter.id);
        if (fil) fil.values = new Array<string>();
        this.init();
    }

    search() {
        if (this._filtro)
            switch (this._filtro.type) {
                case TypeFilter.LIKE:
                    this.listar(this._filtro.id, this._page.numIni, this._page.numFim, ["0",this._filtro.values[0]]);
                    break;
                default:
                    this.listar(999999, this._page.numIni, this._page.numFim, ["0", "999999"]);
            }
    }

    async listar(filtro: number, numIni: number, numFim: number, params: string[] = [this._usuarioLogado.usuario.cadastrao.id.toString()]) {
        let res = await this._usuarioService.listar(filtro, numIni, numFim, params);
        if (AmfUtil.validarResponseList(res)) {
            this._rows = res.data.body.registros.map(row => Object.assign(UsuarioUtil.getInstance(), row));
            this._page = TableUtil.getPage(res.data.body.numReg, this._page.pagina, this._page.limit);
            this.buscando = false;
        }
    }

    onPage(pageInfo) {
        this._rowSelected = new Array<Usuario>();
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

    async onAlterar(row: Usuario) {
        try {
            if (!this._permissions.hasPermissionAlterarUsuario) {
                this._notificationService.warning(NotificationConst.TITLE_WARNING, 'Usuário sem permissão.');
                return;
            }
            let res = await this._usuarioService.locate(row.id);
            if (AmfUtil.validarResponse(res))
                this.modalUsuario.editar(Object.assign(UsuarioUtil.getInstance(), res.data.body));
        } catch (e) {
            console.error(e);
            this._notificationService.error(NotificationConst.TITLE_DEFAULT, this.getMensagemErro(e.message));
        }
    }

    onExcluir(row) {
        this._alertService.question('Confirmação', 'Deseja realmente excluir o usuário?', () => this.excluir(row.id));
    }

    private async excluir(id: number) {
        try {
            let res = await this._usuarioService.excluir(id);

            if (AmfUtil.validarResponse(res)) {
                let mensagem = res.data.body;
                if (mensagem == MensagemConst.MSGDELETEOK) {
                    this._notificationService.success(NotificationConst.TITLE_SUCCESS, mensagem);
                    this._rowSelected = new Array<Usuario>();
                    this.search();
                } else
                    this._notificationService.warning(NotificationConst.TITLE_WARNING, mensagem);
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
        this.modalUsuario.adicionar();
    }

    onCloseModal() {
        this.search();
    }
    
    private ItemGridSituacaoUsuario( value: string ): string {
        switch( value ) {
            case "A":
                return "Ativo";
                break;
            case "I":
                return "Inativo";
                break;
            default:
                return " ";
        }
    }
			
    private ItemGridTipoUsuario( value: string ): string {
        switch( value ) {
            case "VE":
                return "Vendedor";
                break;
            case "ME":
                return "Mercado";
                break;
            case "FO":
                return "Fornecedor";
                break;
            case "AD":
                return "Administrador";
                break;
            case "FI":
                return "Filial";
                break;
            default:
                return "Desconhecida";
        }
    }

}
