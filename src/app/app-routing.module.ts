import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './layout/admin/admin.component';
import {AuthComponent} from "./layout/auth/auth.component";
import {AuthGuardService} from "./guards/auth-guard.service";

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
      },
      {
        path: 'auth',
        loadChildren: './module/auth/auth.module#AuthModule'
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'movimentacao',
        loadChildren: './module/movimentacao/movimentacao.module#MovimentacaoModule',
        canActivate: [AuthGuardService]
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'cadastro',
        loadChildren: './module/cadastro/cadastro.module#CadastroModule',
        canActivate: [AuthGuardService]
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'manutencao',
        loadChildren: './module/manutencao/manutencao.module#ManutencaoModule',
        canActivate: [AuthGuardService]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
