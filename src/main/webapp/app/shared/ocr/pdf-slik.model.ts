export interface IPDFSlik {
  bank?: string;
  limit?: string;
  outstanding?: string;
  facilityType?: string;
  rate?: string;
  period?: string;
  collateralType?: string;
  collateralIdrMio?: string;
  tenor?: string;
  kolTerakhir?: string;
  kolTerburuk?: string;
  caraRestrukturasi?: string;
  keterangan?: string;
  sebabMacet?: string;
  tanggalMacet?: string;
  tunggakanPokok?: string;
  tunggakanBunga?: string;
  frekuensiTunggakan?: string;
  denda?: string;
  frekuensiRestrukturasi?: string;
  tanggalRestrukturasiAkhir?: string;
  debtorName?: string;
  sumCollateralIdrMio?: string;
  tanggalAkadAwal?: string;
  tanggalMulai?: string;
  tanggalJatuhTempo?: string;
  typeOfFacility?: string;
  kondisi?: string;
  partySlikCollaterals?: any;
}

export class PDFSlik implements IPDFSlik {
  constructor(
    public bank?: string,
    public limit?: string,
    public outstanding?: string,
    public facilityType?: string,
    public rate?: string,
    public period?: string,
    public collateralType?: string,
    public collateralIdrMio?: string,
    public tenor?: string,
    public kolTerakhir?: string,
    public kolTerburuk?: string,
    public caraRestrukturasi?: string,
    public keterangan?: string,
    public sebabMacet?: string,
    public tanggalMacet?: string,
    public tunggakanPokok?: string,
    public tunggakanBunga?: string,
    public frekuensiTunggakan?: string,
    public denda?: string,
    public frekuensiRestrukturasi?: string,
    public tanggalRestrukturasiAkhir?: string,
    public debtorName?: string,
    public sumCollateralIdrMio?: string,
    public tanggalAkadAwal?: string,
    public tanggalMulai?: string,
    public tanggalJatuhTempo?: string,
    public typeOfFacility?: string,
    public kondisi?: string,
    public partySlikCollaterals?: any
  ) {}
}
