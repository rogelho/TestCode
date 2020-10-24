import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {UsuarioLogadoStorageService} from "../storage/usuario/usuario-logado-storage.service";
import {JSessionIdCookieService} from "../storage/usuario/jsession-id-cookie.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private _UsuarioLogadoStorageService: UsuarioLogadoStorageService,
              private _jSessionIdCookieService: JSessionIdCookieService,
              private _router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this._UsuarioLogadoStorageService.get().usuario || !this._jSessionIdCookieService.get()) {
      return this._router.parseUrl('');
    }
    return true;
  }

}
