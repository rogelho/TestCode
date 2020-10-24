import {Injectable} from '@angular/core';
import Swal, { SweetAlertType } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor() {
    }

    question(titulo: string, mensagem: string, callbackConfirm?) {
        Swal({
            title: titulo,
            text: mensagem,
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) callbackConfirm();
        });
    }

    message(titulo: string, mensagem: string) {
        Swal({
            title: titulo,
            text: mensagem,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Voltar',
        }).catch(Swal.noop);
    }

    questionV2(title: string, text: string, type: SweetAlertType, callbackConfirm?) {
        Swal({
            title,
            text,
            type,     
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) callbackConfirm();
        });
    }

    messageV2(title: string, text: string, type: SweetAlertType) {
        Swal({
            title,
            text,
            type,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Fechar',
        }).catch(Swal.noop);
    }
}
