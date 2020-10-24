import {Injectable} from '@angular/core';
import {UsuarioLogado} from "../../model/usuario/usuario-logado";
import {UsuarioLogadoUtil} from "../../util/usuario-logado-util";

@Injectable({
  providedIn: 'root'
})
export class UsuarioLogadoStorageService {

  private _KEY = 'USUARIO_LOGADO';

  constructor() {
  }

  public set(usuarioLogado: UsuarioLogado) {
    localStorage.setItem(this._KEY, JSON.stringify(usuarioLogado));
  }

  public get(): UsuarioLogado {
    return Object.assign(UsuarioLogadoUtil.getInstance(), JSON.parse(localStorage.getItem(this._KEY)));
  }

  public remove() {
    localStorage.removeItem(this._KEY);
  }

}
