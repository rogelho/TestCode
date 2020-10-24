import {Page} from "../model/shared/page";
import {Filter} from "../model/shared/filter";
import {TypeFilter} from "../enum/shared/type-filter.enum";

export class TableUtil {

    static getMessagesDefault(): any {
        return {
            emptyMessage: 'Nenhum registro encontrado',
            totalMessage: 'Registros',
            selectedMessage: 'Selecionado'
        };
    }

    static getConfig(): any {
        return {
            columnMode: 'force',
            headerHeight: 50,
            footerHeight: 50,
            rowHeight: 50,
            limit: 10,
            externalPaging: true,
            externalSorting: true
        };
    }

    static getPage(numReg: number, pagina: number, limit: number = 10): Page {
        let totalPagina = Math.ceil(numReg / limit);
        let numIni = pagina * limit + 1;
        let numFim = Math.min(numIni + limit, numReg);

        return new Page(pagina, limit, totalPagina, numIni, numFim, numReg);
    }

    static getPageDefault(): Page {
        return new Page(0, TableUtil.getConfig().limit, 0, 0, TableUtil.getConfig().limit, 0);
    }

    static ordenar(list: any[], sort: { dir: string, prop: string }) {
        if (list.length) {
            let atribute = Object.getOwnPropertyNames(list[0]).find(atrr => atrr == sort.prop);
            if (atribute)
                sort.dir == 'asc'
                    ? list.sort((a, b) => a[atribute] - b[atribute])
                    : list.sort((a, b) => b[atribute] - a[atribute]);
        }
    }

    static getFiltroSelecionado(filters: Filter[]): Filter {
        let filter = filters.find(filter => {
            if (filter.isBetween()) return !!(filter.values[0] && filter.values[1]);
            if (filter.isSelect()) return !!(filter.values[0]);
            if (filter.isLike()) return !!(filter.values[0]);
            return false;
        });
        return filter ? filter : new Filter(0, 'TODOS', TypeFilter.NON);
    }

}
