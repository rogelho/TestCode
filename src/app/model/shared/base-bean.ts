export class BaseBean {

  _explicitType: string = 'br.com.sgsistemas.cotacao.cotacaoweb.beans.BaseBean';
  id: number;

  constructor(id?: number) {
      this.id = (id == undefined ? 0 : id);
  }

}
