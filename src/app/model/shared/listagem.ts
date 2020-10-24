export class Listagem {

    _explicitType: string = 'br.com.sgsistemas.cotacao.cotacaoweb.utils.Listagem';
    numReg: number;
    registros: any[];

    constructor(numReg?: number,
                registros?: any[]) {
        this.numReg = numReg;
        this.registros = registros;
    }

}
