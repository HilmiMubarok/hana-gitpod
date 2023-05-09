import { String } from 'lodash';

export interface IPartySlik {
  id?: number;
  partyId?: string;
  bank?: string;
  limit?: number;
  outstanding?: number;
  collateralType?: string;
  collateralIdrMio?: number;
  facilityType?: string;
  rate?: number;
  period?: string;
  tenor?: number;
  description?: string;
  arrearsReason?: string;
  arrearsDate?: Date;
  arrearsBase?: number;
  arrearsInterest?: number;
  arrearsFrequency?: number;
  fee?: number;
  restructureFrequency?: number;
  restructureDateFrom?: Date;
  restructureDateThru?: Date;
  lastCollectability?: number;
  worstCollectability?: number;
  restructureType?: number;
  attributes?: any;
  debtorName?: string;
  bankPelapor?: string;
  tanggalAkadAwal?: any;
  tanggalMulai?: any;
  tanggalJatuhTempo?: any;
  kondisi?: any;
  totalAgunan?: any;
  sumCollateralIdrMio?: any;
  typeOfFacility?: any;
  plafond?: any;
}

export class PartySlik implements IPartySlik {
  constructor(
    public id?: number,
    public partyId?: string,
    public bank?: string,
    public limit?: number,
    public outstanding?: number,
    public collateralType?: string,
    public collateralIdrMio?: number,
    public facilityType?: string,
    public rate?: number,
    public period?: string,
    public tenor?: number,
    public description?: string,
    public arrearsReason?: string,
    public arrearsDate?: Date,
    public arrearsBase?: number,
    public arrearsInterest?: number,
    public arrearsFrequency?: number,
    public fee?: number,
    public restructureFrequency?: number,
    public restructureDateFrom?: Date,
    public restructureDateThru?: Date,
    public lastCollectability?: number,
    public worstCollectability?: number,
    public restructureType?: number,
    public attributes?: any,
    public debtorName?: any,
    public bankPelapor?: string,
    public tanggalAkadAwal?: any,
    public tanggalMulai?: any,
    public tanggalJatuhTempo?: any,
    public kondisi?: any,
    public totalAgunan?: any,
    public sumCollateralIdrMio?: any,
    public typeOfFacility?: any,
    public plafond?: any
  ) {}
}
