import { IUom } from 'app/entities/uom/uom.model';
import * as uuid from 'uuid';
export interface INilaiRac {
  id?: string;
  nilaiPembelian?: string;
  ccy?: string;
  facilityType?: string;
  jenisJaminan?: string;
  keteranganJaminan?: string;
  lovBelow?: any;
}

export class NilaiRac {
  constructor(
    public id?: string,
    public nilaiPembelian?: string,
    public ccy?: string,
    public facilityType?: string,
    public jenisJaminan?: string,
    public keteranganJaminan?: string,
    public lovBelow?: string
  ) {
    this.id = uuid.v4();
    this.nilaiPembelian = '';
    this.ccy = '';
    this.facilityType = '';
    this.jenisJaminan = '';
    this.keteranganJaminan = '';
  }
}
