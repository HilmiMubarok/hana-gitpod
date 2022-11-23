export interface IEmptyField {
  collateralId?: number;
  bunga?: string;
  kondisi?: string;
  tanggalVerifikasi?: string;
}

export class EmptyField implements IEmptyField {
  constructor(public collateralId?: number, public bunga?: string, public kondisi?: string, public tanggalVerifikasi?: string) {
    this.collateralId = 0;
    this.bunga = '';
    this.kondisi = '';
    this.tanggalVerifikasi = '';
  }
}
