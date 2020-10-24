import {Injectable} from '@angular/core';
import {UsuarioLembrarMe} from "../../model/usuario/usuario-lembrar-me";

@Injectable({
  providedIn: 'root'
})
export class LembraMeStorageService {

  private _KEY = 'LEMBRAR_ME';

  constructor() {
  }

  set(usuarioLembrarMe: UsuarioLembrarMe) {
    localStorage.setItem(this._KEY, JSON.stringify(usuarioLembrarMe));
  }

  get(): UsuarioLembrarMe {
    return Object.assign(new UsuarioLembrarMe(), JSON.parse(localStorage.getItem(this._KEY)));
  }

  remove() {
    localStorage.removeItem(this._KEY);
  }
}
