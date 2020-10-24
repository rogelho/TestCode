import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {ManutencaoRoutingModule} from './manutencao-routing.module';
import {UsuarioComponent} from './component/usuario/usuario.component';
import {SharedModule} from "../../shared/shared.module";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ToastyModule} from "ng2-toasty";
import {SelectModule} from "ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModalUsuarioComponent} from "./component/usuario/modal/modal-usuario/modal-usuario.component";
import {NgxMaskModule} from "ngx-mask";
import {PesquisaModule} from "../../component/pesquisa/pesquisa.module";

@NgModule({
    declarations: [
        UsuarioComponent,
        ModalUsuarioComponent
    ],
    imports: [
        CommonModule,
        ManutencaoRoutingModule,
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
    ]
})
export class ManutencaoModule {
}