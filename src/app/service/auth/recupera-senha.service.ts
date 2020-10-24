import { JSessionIdCookieService } from './../../storage/usuario/jsession-id-cookie.service';
import { Injectable } from '@angular/core';
import { AmfAbstractService } from "../amf-abstract.service";
import { ResponseAmf } from "../../model/shared/response-amf";
import { Usuario } from "../../model/usuario/usuario";

@Injectable({
    providedIn: 'root'
})
export class RecuperaSenhaService extends AmfAbstractService {

    constructor(private _jSessionIdCookieService: JSessionIdCookieService) {
        super(RecuperaSenhaService.name);
    }

    enviarChaveRecuperacaoParaEmail(email: string): Promise<ResponseAmf> {
        return this._amf.invoke(RecuperaSenhaService.name, 'SolicitaChave', [email]);
    }

    recuperarSenha(email: string, chaveRecuperacao: string): Promise<ResponseAmf> {
        return this._amf.invoke(RecuperaSenhaService.name, 'RecuperaSenha', [email, chaveRecuperacao]);
    }

    alterarSenha(usuario: Usuario, novaSenha: string, senhaAntiga: string, verificaSenhaAntiga: boolean): Promise<ResponseAmf> {
        return this._amf.invoke(RecuperaSenhaService.name, 'TrocarSenha', [verificaSenhaAntiga, [usuario.id, senhaAntiga, novaSenha]], this._jSessionIdCookieService.get());
    }

}
