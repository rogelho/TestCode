import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./component/login/login.component";
import {PrimeiroAcessoComponent} from "./component/primeiro-acesso/primeiro-acesso.component";
import {AuthGuardService} from "../../guards/auth-guard.service";
import {EsqueceuSenhaComponent} from "./component/esqueceu-senha/esqueceu-senha.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'primeiro-acesso',
    component: PrimeiroAcessoComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'esqueceu-senha',
    component: EsqueceuSenhaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
