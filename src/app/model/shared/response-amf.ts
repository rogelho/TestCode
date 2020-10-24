export class ResponseAmf {

  code: number;
  message: string;
  detail: any;
  data: any;
  headers: any[];

  constructor(code?: number,
              message?: string,
              detail?: any,
              data?: any,
              headers?: any[]) {
    this.code = code;
    this.message = message;
    this.detail = detail;
    this.data = data;
    this.headers = headers;
  }

}
