import {BaseBean} from "./base-bean";

export class Versao extends BaseBean{

  dataversao: Date;
  baseline: string;

  constructor(id?: number,
              dataversao?: Date,
              baseline?: string) {
    super(id);
    this.dataversao = dataversao;
    this.baseline = baseline;
  }

}
