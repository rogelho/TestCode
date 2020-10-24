import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilialComponent} from "./component/filial/filial.component";
import {SharedModule} from "../../shared/shared.module";
import {FiltroComponent} from "./component/filtro/filtro.component";
import {SelectModule} from "ng-select";
import {FormsModule} from "@angular/forms";
import {NgxMaskModule} from "ngx-mask";

@NgModule({
    declarations: [
        FilialComponent,
        FiltroComponent
    ],
    imports: [
        SharedModule,
        CommonModule,
        SelectModule,
        FormsModule,
        NgxMaskModule
    ],
    exports: [
        FilialComponent,
        FiltroComponent
    ],
})
export class PesquisaModule {
}
