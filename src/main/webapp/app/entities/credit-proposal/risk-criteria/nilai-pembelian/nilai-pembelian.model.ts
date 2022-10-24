import * as uuid from 'uuid';
export interface INilaiRac {
  id?: string;
  nilaiPembelian?: string;
  facilityType?: string;
  jenisJaminan?: string;
  keteranganJaminan?: string;
  lovBelow?: any;
}

export class NilaiRac {
  constructor(
    public id?: string,
    public nilaiPembelian?: string,
    public facilityType?: string,
    public jenisJaminan?: string,
    public keteranganJaminan?: string,
    public lovBelow?: string
  ) {
    this.id = uuid.v4();
    this.nilaiPembelian = '';
    this.facilityType = '';
    this.jenisJaminan = '';
    this.keteranganJaminan = '';
  }
}
