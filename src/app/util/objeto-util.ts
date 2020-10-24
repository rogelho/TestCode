export class ObjetoUtil{
    static novoObjetoSemReferencia(novo, velho){
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
}