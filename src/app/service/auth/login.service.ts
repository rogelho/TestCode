import {Injectable} from '@angular/core';
import {Usuario} from "../../model/usuario/usuario";
import {ResponseAmf} from "../../model/shared/response-amf";
import {AmfAbstractService} from "../amf-abstract.service";
import {JSessionIdCookieService} from "../../storage/usuario/jsession-id-cookie.service";
import {UsuarioLogadoStorageService} from "../../storage/usuario/usuario-logado-storage.service";
import {MercadoStorageService} from "../../storage/mercado/mercado-storage.service";

@Injectable({
    providedIn: 'root'
})
export class LoginService extends AmfAbstractService {

    constructor(private _jSessionIdCookieService: JSessionIdCookieService,
                private _usuarioLogadoStorageService: UsuarioLogadoStorageService,
                private _mercadoStorage: MercadoStorageService) {
        super(LoginService.name);
    }

    login(usuario: Usuario): Promise<ResponseAmf> {
        return this._amf.invoke(LoginService.name, 'Logar', [usuario]);
    }

    async logOut(): Promise<ResponseAmf> {
        let res = await this._amf.invoke(LoginService.name, 'LogOut', [], this._jSessionIdCookieService.get());
        this._usuarioLogadoStorageService.remove();
        this._jSessionIdCookieService.remove();
        this._mercadoStorage.remove();
        return res;
    }

    trocarUsuario(idMercado: number): Promise<ResponseAmf> {
        return this._amf.invoke(LoginService.name, 'TrocarUsuario', [idMercado], this._jSessionIdCookieService.get());
    }
}
