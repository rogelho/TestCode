export class AmfUtil {

    static validarResponse(response): boolean {
        if (!response.data) {
            console.error('Não retornado nenhum data.');
            return false;
        }
        if (!response.data.body) {
            console.error('Não retornado nenhum body.');
            return false;
        }
        return true;
    }

    static validarResponseList(response): boolean {
        if (!response.data) {
            console.error('Não retornado nenhum data.');
            return false;
        }
        if (!response.data.body) {
            console.error('Não retornado nenhum body.');
            return false;
        }
        if (!response.data.body.registros) {
            console.error('Não retornado nenhum registro.');
            return false;
        }
        return true;
    }

}
