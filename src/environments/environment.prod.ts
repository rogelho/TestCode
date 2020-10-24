import {version} from "../../package.json";

export const environment = {
    production: true,
    version: version,
    urlAmf: 'http://localhost:8080/CotacaoWeb/messagebroker/amf',
    urlApi: 'http://localhost:8080/CotacaoWeb/servlet/',
    host: 'http://localhost:8080',
};
