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

// ---------------------------------------------------------------------
export interface IAnalysisOfCalculation {
  id?: string;
  ar?: number;
  inventory?: number;
  accountPayable?: number;
  accruedExpensive?: number;
  depreciation?: number;
  depreciationDays?: number;
  wcNeeds?: number;
  plafondOfWc?: number;
}

export class AnalysisOfCalculation implements IAnalysisOfCalculation {
  constructor(
    public id?: string,
    public ar?: number,
    public inventory?: number,
    public accountPayable?: number,
    public accruedExpensive?: number,
    public depreciation?: number,
    public depreciationDays?: number,
    public wcNeeds?: number,
    public plafondOfWc?: number
  ) {
    this.ar = 0;
    this.inventory = 0;
    this.accountPayable = 0;
    this.accruedExpensive = 0;
    this.depreciation = 0;
    this.wcNeeds = 0;
    this.plafondOfWc = 0;
    this.depreciationDays = 0;
  }
}
