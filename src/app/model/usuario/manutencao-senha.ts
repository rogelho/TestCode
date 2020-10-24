import {Usuario} from "./usuario";

export class ManutencaoSenha {

  usuario: Usuario;
  senhaAntiga: string;
  considerarSenhaAntiga: boolean;

  constructor(usuario?: Usuario,
              senhaAntiga?: string,
              considerarSenhaAntiga?: boolean) {
    this.usuario = usuario;
    this.senhaAntiga = senhaAntiga;
    this.considerarSenhaAntiga = considerarSenhaAntiga;
  }

}
