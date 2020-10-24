import { ModalParamComponent } from './layout/admin/modal/modal-parametros/modal-parametros-component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ModalChangePassComponent } from './layout/admin/modal/modal-change-pass/modal-change-pass-component';
import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {AdminComponent} from './layout/admin/admin.component';
import {AuthComponent} from './layout/auth/auth.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';
import {MenuItems} from './shared/menu-items/menu-items';
import {BreadcrumbsComponent} from './layout/admin/breadcrumbs/breadcrumbs.component';
import {ToastyModule} from "ng2-toasty";
import {CookieService} from "ngx-cookie-service";
import {AuthGuardService} from "./guards/auth-guard.service";
import {NgxMaskModule} from "ngx-mask";
import {registerLocaleData} from '@angular/common';
import localePTBR from '@angular/common/locales/pt';
import * as moment from 'moment';
import {ModalAlterarSenhaUsuariosComponent} from "./layout/admin/modal/modal-alterar-senha-usuarios/modal-alterar-senha-usuarios-component";
import {SelectModule} from "ng-select";

registerLocaleData(localePTBR);
moment.locale('pt-br');

@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        AuthComponent,
        BreadcrumbsComponent,
        ModalChangePassComponent,
        ModalAlterarSenhaUsuariosComponent,
        ModalParamComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        ToastyModule.forRoot(),
        NgxMaskModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        NgxMaskModule.forRoot(),
        SelectModule,

    ],
    providers: [
        MenuItems,
        CookieService,
        AuthGuardService,
        {provide: LOCALE_ID, useValue: 'pt-BR'}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
