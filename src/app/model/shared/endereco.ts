import {BaseBean} from "./base-bean";


export class Endereco extends BaseBean{
  public _explicitType: string = 'br.com.sgsistemas.cotacao.cotacaoweb.beans.Endereco';
  public endereco: string;
  public numero: string;
  public cidade: string;
  public bairro: string;
  public cep: string;
  public uf: string;

  constructor(
              endereco?: string,
              numero?: string,
              cidade?: string,
              bairro?: string,
              cep?: string,
              uf?: string,
              id?: number) {
    super(id);
    this.endereco = endereco;
    this.numero = numero;
    this.cidade = cidade;
    this.bairro = bairro;
    this.cep = cep;
    this.uf = uf;
  }

}
