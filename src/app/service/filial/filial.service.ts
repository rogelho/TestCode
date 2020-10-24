import {Injectable} from '@angular/core';
import {ResponseAmf} from "../../model/shared/response-amf";
import {AmfAbstractService} from "../amf-abstract.service";
import {JSessionIdCookieService} from "../../storage/usuario/jsession-id-cookie.service";
import {Mercado} from "../../model/mercado/mercado";
import {Endereco} from "../../model/shared/endereco";
import {Filial} from "../../model/filial/filial";

@Injectable({
    providedIn: 'root'
})
export class FilialService extends AmfAbstractService {

    constructor(private _jSessionIdCookieService: JSessionIdCookieService) {
        super(FilialService.name);
    }

    excluir(idFilial) {
        return this._amf.invoke(FilialService.name, 'Excluir', idFilial, this._jSessionIdCookieService.get());
    }

    listar(filtro: number, numIni: number, numFim: number, params: string[]): Promise<ResponseAmf> {
        return this._amf.invoke(FilialService.name, 'Listar', [filtro, numIni, numFim, params], this._jSessionIdCookieService.get());
    }

    locateByCnpj(cnpj: string) {
        return this._amf.invoke(FilialService.name, 'locateByCnpj', cnpj, this._jSessionIdCookieService.get());
    }

    async SaveOrUpdate(mercado: Mercado, filial: Filial) {
        console.log('mercado', mercado);
        console.log('filial', filial);
        let new_mercado = this.setFieldsNewArray(new Mercado(), mercado);
        let new_filial = this.setFieldsNewArray(new Filial(), filial);
        new_mercado.endereco = this.setFieldsNewArray(new Endereco(), mercado.endereco);
        new_filial.endereco = this.setFieldsNewArray(new Endereco(), filial.endereco);
        console.log('new_mercado', new_mercado);
        console.log('new_filial', new_filial);
        return this._amf.invoke(FilialService.name, 'SaveOrUpdate', [new_filial, new_mercado], this._jSessionIdCookieService.get());
    }

    setFieldsNewArray(novo, velho){
        let new_chaves = Object.keys(novo);
        let chaves = Object.keys(velho);
        new_chaves.forEach((new_chave) => {
            if(new_chave != '_explicitType'){
                chaves.forEach((chave)=>{
                    if(chave == new_chave){
                        novo[new_chave] =  velho[chave];
                    }
                })
            }
        });
        return novo;
    }

    locate(id: number): Promise<ResponseAmf>  {
        return this._amf.invoke(FilialService.name, 'Locate', [id], this._jSessionIdCookieService.get());
    }
}
