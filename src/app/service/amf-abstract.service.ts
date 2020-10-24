import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";

declare var amf: any;

@Injectable({
  providedIn: 'root'
})
export class AmfAbstractService {

  protected _amf: any;

  constructor(destination: string) {
    this._amf = new amf.Client(destination, environment.urlAmf);
  }

}
