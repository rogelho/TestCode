import {Cadastrao} from "../shared/cadastrao";
import {BaseBean} from "../shared/base-bean";
import {PermUsuario} from "./perm-usuario";

export class Usuario extends BaseBean {

  _explicitType: string = 'br.com.sgsistemas.cotacao.cotacaoweb.beans.Usuario';
  id: number;
  cadastrao: Cadastrao;
  login: string;
  senha: string;
  nome: string;
  email: string;
  tipo: string;
  situacao: string;
  permissoes: PermUsuario[];
  agrupaCotacao: string;
  chave: string;
  dtExpiraChave: Date;

  constructor(id?: number,
              cadastrao?: Cadastrao,
              login?: string,
              senha?: string,
              nome?: string,
              email?: string,
              tipo?: string,
              situacao?: string,
              permissoes?: PermUsuario[],
              agrupaCotacao?: string,
              chave?: string,
              dtExpiraChave?: Date) {
    super(id);
    this.id = id;
    this.cadastrao = cadastrao;
    this.login = login;
    this.senha = senha;
    this.nome = nome;
    this.email = email;
    this.tipo = tipo;
    this.situacao = situacao;
    this.permissoes = permissoes;
    this.agrupaCotacao = agrupaCotacao;
    this.chave = chave;
    this.dtExpiraChave = dtExpiraChave;
  }

}
