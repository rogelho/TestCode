import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './component/login/login.component';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastyModule} from "ng2-toasty";
import {NotificationService} from "../../service/shared/notification.service";
import {PrimeiroAcessoComponent} from './component/primeiro-acesso/primeiro-acesso.component';
import { EsqueceuSenhaComponent } from './component/esqueceu-senha/esqueceu-senha.component';

@NgModule({
  declarations: [
    LoginComponent,
    PrimeiroAcessoComponent,
    EsqueceuSenhaComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ToastyModule.forRoot()
  ],
  providers: [
    NotificationService
  ]
})
export class AuthModule {
}
