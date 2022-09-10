export interface IPartySlik {
  id?: number;
  partyId?: string;
  bank?: string;
  limit?: number;
  outstanding?: number;
  collateralType?: string;
  collateralIdrMio?: number;
  facilityType?: number;
  rate?: number;
  period?: number;
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
    public facilityType?: number,
    public rate?: number,
    public period?: number,
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
    public attributes?: any
  ) {}
}
