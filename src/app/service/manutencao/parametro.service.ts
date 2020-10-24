import { JSessionIdCookieService } from './../../storage/usuario/jsession-id-cookie.service';
import { AmfAbstractService } from './../amf-abstract.service';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ParametroService extends AmfAbstractService {
  constructor(private _jSessionIdCookieService: JSessionIdCookieService) {
    super(ParametroService.name)
  }

  get() {
    return this._amf.invoke(ParametroService.name, 'Listar', [999999, 0, 100, null], this._jSessionIdCookieService.get())
  }

  save(params) {
    return this._amf.invoke(ParametroService.name, 'Save', [params], this._jSessionIdCookieService.get())
  }
}