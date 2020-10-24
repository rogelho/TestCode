import {Injectable} from '@angular/core';

export interface BadgeItem {
    type: string;
    value: string;
}

export interface ChildrenItems {
    state: string;
    target?: boolean;
    name: string;
    type?: string;
    children?: ChildrenItems[];
}

export interface MainMenuItems {
    state: string;
    short_label?: string;
    main_state?: string;
    target?: boolean;
    name: string;
    type: string;
    icon: string;
    badge?: BadgeItem[];
    children?: ChildrenItems[];
}

export interface Menu {
    label: string;
    main: MainMenuItems[];
}

const MENUITEMS = [
    {
        label: 'Menu',
        main: [
            {
                state: 'cadastro',
                short_label: 'C',
                name: 'Cadastros',
                type: 'sub',
                icon: 'icofont icofont-tasks',
                children: [
                    {
                        state: 'mercado',
                        short_label: 'M',
                        name: 'Mercado',
                        type: 'link',
                        main_state: 'cadastro'
                    },
                    {
                        state: 'fornecedor',
                        short_label: 'F',
                        name: 'Fornecedor',
                        type: 'link',
                        main_state: 'cadastro'
                    },
                    {
                        state: 'filial',
                        short_label: 'F',
                        name: 'Filial',
                        type: 'link',
                        main_state: 'cadastro'
                    },
                    {
                        state: 'vendedor',
                        short_label: 'F',
                        name: 'Vendedor',
                        type: 'link',
                        main_state: 'cadastro'
                    }
                ]
            },
            {
                state: 'movimentacao',
                short_label: 'M',
                name: 'Movimentações',
                type: 'sub',
                icon: 'icofont icofont-settings-alt',
                children: [
                    {
                        state: 'cotacao',
                        short_label: 'C',
                        name: 'Cotação',
                        type: 'link',
                        main_state: 'movimentacao'
                    },
                    {
                        state: 'pedido',
                        short_label: 'P',
                        name: 'Pedido',
                        type: 'link',
                        main_state: 'cadastro'
                    }
                ]
            },
            {
                state: 'relatorio',
                short_label: 'R',
                name: 'Relatórios',
                type: 'sub',
                icon: 'icofont icofont-newspaper',
                children: [
                    {
                        state: 'situacao-cotacao',
                        short_label: 'S',
                        name: 'Situacão da cotação',
                        type: 'link',
                        main_state: 'relatorio'
                    },
                    {
                        state: 'relacao-item-nao-ganho',
                        short_label: 'I',
                        name: 'Relação de itens não ganho',
                        type: 'link',
                        main_state: 'relatorio'
                    }
                ]
            },
            {
                state: 'manutencao',
                short_label: 'R',
                name: 'Manutenções',
                type: 'sub',
                icon: 'icofont icofont-tools-alt-2',
                children: [
                    {
                        state: 'usuario',
                        short_label: 'S',
                        name: 'Usuário',
                        type: 'link',
                        main_state: 'manutencao'
                    },
                    {
                        state: 'log-operacao',
                        short_label: 'S',
                        name: 'Log de operações',
                        type: 'link',
                        main_state: 'manutencao'
                    },
                    {
                        state: 'mensagem',
                        short_label: 'I',
                        name: 'Mensagem',
                        type: 'link',
                        main_state: 'manutencao'
                    },
                    {
                        state: 'banner',
                        short_label: 'I',
                        name: 'Banner',
                        type: 'link',
                        main_state: 'manutencao'
                    }
                ]
            }
        ]
    }
];

@Injectable()
export class MenuItems {
    getAll(): Menu[] {
        return MENUITEMS;
    }
}
