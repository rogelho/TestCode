import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CotacaoComponent} from "./component/cotacao/cotacao.component";
import {PedidoComponent} from "./component/pedido/pedido.component";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'cotacao',
        pathMatch: 'full'
    },
    {
        path: 'cotacao',
        component: CotacaoComponent,
    },
    {
        path: 'pedido',
        component: PedidoComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MovimentacaoRoutingModule {
}
