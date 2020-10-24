import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {MovimentacaoRoutingModule} from './movimentacao-routing.module';
import {CotacaoComponent} from './component/cotacao/cotacao.component';
import {SharedModule} from "../../shared/shared.module";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ToastyModule} from "ng2-toasty";
import {SelectModule} from "ng-select";
import {FormsModule} from "@angular/forms";
import {ModalCotacaoAlterarComponent} from "./component/cotacao/modal/modal-cotacao-alterar/modal-cotacao-alterar.component";
import {NgxMaskModule} from "ngx-mask";
import {ModalCotacaoVisualizarComponent} from './component/cotacao/modal/modal-cotacao-visualizar/modal-cotacao-visualizar.component';
import { ModalCotacaoManutencaoPrePedidoComponent } from './component/cotacao/modal/modal-cotacao-manutencao-pre-pedido/modal-cotacao-manutencao-pre-pedido.component';
import { PedidoComponent } from './component/pedido/pedido.component';
import {PesquisaModule} from "../../component/pesquisa/pesquisa.module";


@NgModule({
    declarations: [
        CotacaoComponent,
        ModalCotacaoAlterarComponent,
        ModalCotacaoVisualizarComponent,
        ModalCotacaoManutencaoPrePedidoComponent,
        PedidoComponent
    ],
    imports: [
        CommonModule,
        MovimentacaoRoutingModule,
        SharedModule,
        NgxDatatableModule,
        ToastyModule,
        SelectModule,
        FormsModule,
        NgxMaskModule,
        PesquisaModule
    ],
    providers: [
        DatePipe
    ],
    entryComponents: [ModalCotacaoAlterarComponent]
})
export class MovimentacaoModule {
}
