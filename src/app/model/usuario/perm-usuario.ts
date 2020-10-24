import {BaseBean} from "../shared/base-bean";

export class PermUsuario extends BaseBean {

  _explicitType: string = 'br.com.sgsistemas.cotacao.cotacaoweb.beans.PermUsuario';
  rotina: string;
  menu: string;
  buscar: string;
  inserir: string;
  alterar: string;
  excluir: string;

  constructor(id?: number,
              rotina?: string,
              menu?: string,
              buscar?: string,
              inserir?: string,
              alterar?: string,
              excluir?: string) {
    super(id);
    this.rotina = rotina;
    this.menu = menu;
    this.buscar = buscar;
    this.inserir = inserir;
    this.alterar = alterar;
    this.excluir = excluir;
  }
}
