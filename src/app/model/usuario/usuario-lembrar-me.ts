export class UsuarioLembrarMe {

  login: string;
  senha: string;
  lembrarMe: boolean;

  constructor(login?: string,
              senha?: string,
              lembrarMe?: boolean) {
    this.login = login;
    this.senha = senha;
    this.lembrarMe = lembrarMe;
  }

}
