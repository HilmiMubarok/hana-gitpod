export interface IProformaLaporanKeuangan {
  id?: string;
  detail?: IProformaLaporanKeuangan;
}

export interface IProformaLaporanKeuanganDetail {
  id?: string;
  totalSales?: number;
  cogs?: number;
  sga?: number;
  totalLiabilities?: number;
  ebt?: number;
}

export class ProformaLaporanKeuanganDetail implements IProformaLaporanKeuanganDetail {
  constructor(
    public id?: string,
    public totalSales?: number,
    public cogs?: number,
    public sga?: number,
    public totalLiabilities?: number,
    public ebt?: number
  ) {
    this.id = null;
    this.totalSales = 0;
    this.cogs = 0;
    this.sga = 0;
    this.totalLiabilities = 0;
    this.ebt = 0;
  }
}

export class ProformaLaporanKeuangan implements IProformaLaporanKeuangan {
  constructor(public id?: string, public detail?: IProformaLaporanKeuanganDetail) {
    this.detail = new ProformaLaporanKeuanganDetail();
  }
}
