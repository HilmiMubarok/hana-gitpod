export interface ICollateralAppraisal {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  applicationId?: number;
  collateralId?: number;
  partyId?: number;
  partyTypeId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  attributes?: any;

  ttlLandMarketValue?: number;
  ttlBuildMarketValue?: number;
  ttlLandLiqValIndication?: number;
  ttlBuildLiqValIndication?: number;
  ttlLandroundMarketValue?: number;
  ttlBuildroundMarketValue?: number;
  ttlLandroundLiqValIndication?: number; // UI Hilmi mana???
  ttlBuildroundLiqValIndication?: number; // UI Hilmi mana???

  ttlMarketVal?: number;
  ttlRandValue?: number;
  ttlLiqValIndication?: number;
  ttlRoundLiqValIndication?: number;

  collObj?: string;
  landVarketVal?: number; // Typo Wa2n???
  marketVal?: number;
  landSizeVal?: number;
  indicationVal?: number;
  percentageVal?: number;
}

export class CollateralAppraisal implements ICollateralAppraisal {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public applicationId?: number,
    public collateralId?: number,
    public partyId?: number,
    public partyTypeId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public attributes?: any,

    public ttlLandMarketValue?: number,
    public ttlBuildMarketValue?: number,
    public ttlLandLiqValIndication?: number,
    public ttlBuildLiqValIndication?: number,
    public ttlLandroundMarketValue?: number,
    public ttlBuildroundMarketValue?: number,
    public ttlLandroundLiqValIndication?: number,
    public ttlBuildroundLiqValIndication?: number,

    public ttlMarketVal?: number,
    public ttlRandValue?: number,
    public ttlLiqValIndication?: number,
    public ttlRoundLiqValIndication?: number,

    public collObj?: string,
    public landVarketVal?: number,
    public marketVal?: number,
    public landSizeVal?: number,
    public indicationVal?: number,
    public percentageVal?: number
  ) {}
}
