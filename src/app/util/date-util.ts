export class DateUtil {
    static dataAtualFormatada() {
        let data = new Date();
        let dia = data.getDate().toString();
        let diaF = (dia.length == 1) ? '0' + dia : dia;
        let mes = (data.getMonth() + 1).toString();
        let mesF = (mes.length == 1) ? '0' + mes : mes;
        let anoF = data.getFullYear();
        return diaF + "/" + mesF + "/" + anoF;
    }

}
