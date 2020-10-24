import {Usuario} from "./usuario";
import {Versao} from "../shared/versao";

export class UsuarioLogado {

    usuario: Usuario;
    situacao: string;
    ip: string;
    versao: Versao;
    chave: string;
    dtExpiraChave: string;

    constructor(usuario?: Usuario,
                situacao?: string,
                ip?: string,
                versao?: Versao,
                chave?: string,
                dtExpiraChave?: string) {
        this.usuario = usuario;
        this.situacao = situacao;
        this.ip = ip;
        this.versao = versao;
        this.chave = chave;
        this.dtExpiraChave = dtExpiraChave;
    }

    isAtivo() {
        return this.situacao === 'A';
    }

    isAdmin() {
        return this.usuario.tipo === 'AD';
    }

    isMercado() {
        return this.usuario.tipo === 'ME';
    }

    isFilial() {
        return this.usuario.tipo === 'FI';
    }

    isFornecedor() {
        return this.usuario.tipo === 'FO';
    }

    isVendedor() {
        return this.usuario.tipo === 'VE';
    }

    isAgrupaCotacao(): boolean {
        return this.usuario.agrupaCotacao == 'S';
    }

    isAgrupaCotacaoAndIsGrupoAdmin(): boolean {
        return this.isAgrupaCotacao() && (this.isAdmin() || this.isMercado() || this.isFilial());
    }
}
