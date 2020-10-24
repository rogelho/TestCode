import {Injectable} from '@angular/core';
import {ToastOptions, ToastyService} from "ng2-toasty";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private _toastOptions: ToastOptions;

    constructor(private _toastyService: ToastyService) {
        this.initToastyConfig();
    }

    error(titulo: string, mensagem: string, timeout?: number) {
        this._toastOptions.title = titulo;
        this._toastOptions.msg = mensagem;
        if (timeout)
            this._toastOptions.timeout = timeout;
        this._toastyService.error(this._toastOptions);
    }

    success(titulo: string, mensagem: string, timeout?: number) {
        this._toastOptions.title = titulo;
        this._toastOptions.msg = mensagem;
        if (timeout)
            this._toastOptions.timeout = timeout;

        this._toastyService.success(this._toastOptions);
    }

    warning(titulo: string, mensagem: string, timeout?: number) {
        this._toastOptions.title = titulo;
        this._toastOptions.msg = mensagem;
        if (timeout)
            this._toastOptions.timeout = timeout;
        this._toastyService.warning(this._toastOptions);
    }

    private initToastyConfig() {
        this._toastOptions = new ToastOptions();
        this._toastOptions.showClose = true;
        this._toastOptions.timeout = 5000;
        this._toastOptions.theme = 'bootstrap';
    }

}
