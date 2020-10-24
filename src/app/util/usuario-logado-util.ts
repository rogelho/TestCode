import {Usuario} from "../model/usuario/usuario";
import {Cadastrao} from "../model/shared/cadastrao";
import {PermUsuario} from "../model/usuario/perm-usuario";
import {UsuarioLogado} from "../model/usuario/usuario-logado";
import {Md5} from "ts-md5";

export class UsuarioLogadoUtil {

    static getInstance() {
        let usuario = new UsuarioLogado();
        usuario.usuario = new Usuario();
        usuario.usuario.cadastrao = new Cadastrao();
        usuario.usuario.permissoes = new Array<PermUsuario>();
        return usuario;
    }

    static isPrimeiroAcesso(usuarioLogado: UsuarioLogado): boolean {
        return Md5.hashStr(usuarioLogado.usuario.login) === usuarioLogado.usuario.senha || usuarioLogado.usuario.senha === Md5.hashStr("1");
    }

    static hasPermission(permissions: PermUsuario[], rotina: string): boolean {
        return !!permissions.find(p => p.rotina === rotina && p.menu === 'S');
    }

    static canChange(permissions: PermUsuario[], rotina:string):boolean {
        return !!permissions.find(p => p.rotina === rotina && p.alterar === 'S')
    }

    static hasPermissionWithOperation(permissions: PermUsuario[], rotina: string,tipo: string): boolean {
        return !!permissions.find(p => p.rotina === rotina && p[tipo] === 'S');
    }
}
