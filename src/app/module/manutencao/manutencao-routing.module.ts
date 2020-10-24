import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsuarioComponent} from "./component/usuario/usuario.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'usuario',
        pathMatch: 'full'
    },
    {
        path: 'usuario',
        component: UsuarioComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManutencaoRoutingModule {
}
