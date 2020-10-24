import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {CadastroRoutingModule} from './cadastro-routing.module';
import {MercadoComponent} from './component/mercado/mercado.component';
import {SharedModule} from "../../shared/shared.module";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ToastyModule} from "ng2-toasty";
import {SelectModule} from "ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModalMercadoComponent} from "./component/mercado/modal/modal-mercado/modal-mercado.component";
import {NgxMaskModule} from "ngx-mask";
import {PesquisaModule} from "../../component/pesquisa/pesquisa.module";
import { FornecedorComponent } from './component/fornecedor/fornecedor.component';
import {ModalFornecedorInserirAlterarComponent} from "./component/fornecedor/modal/modal-fornecedor-inserir-alterar/modal-fornecedor-inserir-alterar.component";
import {FilialEmpresaComponent} from "./component/filial/filial-empresa.component";
import {ModalFilialEmpresaInserirAlterarComponent} from "./component/filial/modal/modal-filial-empresa-inserir-alterar/modal-filial-empresa-inserir-alterar.component";
import {VendedorComponent} from "./component/vendedor/vendedor.component";
import {ModalVendedorInserirAlterarComponent} from "./component/vendedor/modal/modal-vendedor-inserir-alterar/modal-vendedor-inserir-alterar.component";

@NgModule({
    declarations: [
        MercadoComponent,
        ModalMercadoComponent,
        FornecedorComponent,
        ModalFornecedorInserirAlterarComponent,
        FilialEmpresaComponent,
        ModalFilialEmpresaInserirAlterarComponent,
        VendedorComponent,
        ModalFornecedorInserirAlterarComponent,
        ModalVendedorInserirAlterarComponent
    ],
    imports: [
        CommonModule,
        CadastroRoutingModule,
        SharedModule,
        NgxDatatableModule,
        ToastyModule,
        SelectModule,
        FormsModule,
        NgxMaskModule,
        PesquisaModule,
        ReactiveFormsModule
    ],
    providers: [
        DatePipe
    ],
   entryComponents: [ModalFornecedorInserirAlterarComponent, ModalVendedorInserirAlterarComponent]
})
export class CadastroModule {
}
