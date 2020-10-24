import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MercadoComponent} from "./component/mercado/mercado.component";
import {FornecedorComponent} from "./component/fornecedor/fornecedor.component";
import {FilialComponent} from "../../component/pesquisa/component/filial/filial.component";
import {FilialEmpresaComponent} from "./component/filial/filial-empresa.component";
import {VendedorComponent} from "./component/vendedor/vendedor.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'mercado',
        pathMatch: 'full'
    },
    {
        path: 'mercado',
        component: MercadoComponent,
    },
    {
        path: 'filial',
        component: FilialEmpresaComponent,
    },
    {
        path: 'fornecedor',
        component: FornecedorComponent,
    },
    {
        path: 'vendedor',
        component: VendedorComponent,
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CadastroRoutingModule {
}
