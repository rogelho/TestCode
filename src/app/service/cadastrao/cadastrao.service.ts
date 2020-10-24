import {Injectable} from '@angular/core';
import {AmfAbstractService} from "../amf-abstract.service";
import {JSessionIdCookieService} from "../../storage/usuario/jsession-id-cookie.service";
import {ResponseAmf} from "../../model/shared/response-amf";

@Injectable({
    providedIn: 'root'
})
export class CadastraoService extends AmfAbstractService {

    constructor(private _jSessionIdCookieService: JSessionIdCookieService) {
        super(CadastraoService.name);
    }

    listar(): Promise<ResponseAmf> {
        return this._amf.invoke(CadastraoService.name, 'ListarUsuariosDisponiveis', [], this._jSessionIdCookieService.get());
    }

}
