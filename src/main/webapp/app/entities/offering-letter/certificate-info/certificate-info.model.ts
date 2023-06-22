export interface ICertificateInfo {
  id?: number;
  buktiKepemilikan?: string;
  jangkaWaktuKepemilikan?: string;
  luasTanah?: number;
  luasBangunan?: number;
}

export class CertificateInfo implements ICertificateInfo {
  constructor(public id?: number, public buktiKepemilikan?: string, public luasTanah?: number, public luasBangunan?: number) {}
}
