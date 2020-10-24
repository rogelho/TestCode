import {Usuario} from "../model/usuario/usuario";
import {Cadastrao} from "../model/shared/cadastrao";
import {PermUsuario} from "../model/usuario/perm-usuario";

export class UsuarioUtil {

  static getInstance() {
    let usuario = new Usuario();
    usuario.cadastrao = new Cadastrao();
    usuario.permissoes = new Array<PermUsuario>();
    return usuario;
  }

}
