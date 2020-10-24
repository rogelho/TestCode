import {Injectable} from '@angular/core';
import {AmfAbstractService} from "../amf-abstract.service";
import {JSessionIdCookieService} from "../../storage/usuario/jsession-id-cookie.service";
import {ResponseAmf} from "../../model/shared/response-amf";
import {ManutencaoSenha} from "../../model/usuario/manutencao-senha";
import {Usuario} from "../../model/usuario/usuario";

@Injectable({
    providedIn: 'root'
})
export class UsuarioService extends AmfAbstractService {

    constructor(private _jSessionIdCookieService: JSessionIdCookieService) {
        super(UsuarioService.name);
    }

    alterarSenha(manutencaoSenha: ManutencaoSenha): Promise<ResponseAmf> {
        return this._amf.invoke(UsuarioService.name, 'AlterarSenha', [manutencaoSenha.usuario, manutencaoSenha.senhaAntiga, manutencaoSenha.considerarSenhaAntiga], this._jSessionIdCookieService.get());
    }

    listar(filtro: number, numIni: number, numFim: number, params: string[]): Promise<ResponseAmf> {
        return this._amf.invoke(UsuarioService.name, 'Listar', [filtro, numIni, numFim, params], this._jSessionIdCookieService.get());
    }

    locate(id: number): Promise<ResponseAmf> {
        return this._amf.invoke(UsuarioService.name, 'Locate', [id], this._jSessionIdCookieService.get());
    }

    async saveOrUpdate(usuario: Usuario): Promise<ResponseAmf> {
        return this._amf.invoke(UsuarioService.name, 'SaveOrUpdate', [usuario], this._jSessionIdCookieService.get());
    }

    excluir(id: number) {
        return this._amf.invoke(UsuarioService.name, 'Excluir', id, this._jSessionIdCookieService.get());
    }

  ListarExterno(filtro: number, numIni: number, numFim: number, params: string[]): Promise<ResponseAmf> {
    //0 100 true
    console.log('entrou listar');
    return this._amf.invoke(UsuarioService.name, 'Listar', [filtro, numIni, numFim, params], this._jSessionIdCookieService.get());
  }

}
