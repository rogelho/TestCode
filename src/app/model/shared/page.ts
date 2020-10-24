export class Page {

    pagina: number;
    limit: number;
    totalPagina: number;
    numIni: number;
    numFim: number;
    numReg: number;

    constructor(pagina?: number,
                limit?: number,
                totalPagina?: number,
                numIni?: number,
                numFim?: number,
                numReg?: number) {
        this.pagina = pagina;
        this.limit = limit;
        this.totalPagina = totalPagina;
        this.numIni = numIni;
        this.numFim = numFim;
        this.numReg = numReg;
    }
}
