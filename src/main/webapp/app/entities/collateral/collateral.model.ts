export interface ICollateral {
  id?: number;
  collDetailType?: string;
  qtySize?: number;
  guaranteeAmount?: number;
  guaranteeType?: string;
  marketValue?: number;
  guarantee_coverage?: string;
  certificateNum?: string;
  certificateDateFrom?: Date;
  certificateDateThru?: Date;
  country?: string;
  location?: string;
  issuerCustomer?: string;
  bisColDetailType?: string;
  issuingInstution?: string;
  issInstBicCod?: string;
  lgApplicant?: string;
  creditRatingOffice?: string;
  approvedCreditLinev?: string;
  custodian?: string;
  accOfficer?: string;
  collateralCode?: string;
  collBindingType?: string;
  registrationDate?: Date;
  contractDate?: Date;
  releaseDate?: Date;
  collateralOwner?: string;
  loanCustomer?: string;
  facilityType?: string;
  collateralStatus?: string;
  collateralGrading?: string;
  bindingDate?: Date;
  paripasuStatus?: string;
  collCharacteristic?: string;
  issuer?: string;
  ratingInstitution?: string;
  issuerRating?: string;
  ratingDate?: Date;
  fromDate?: Date;
  thruDate?: Date;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  collateralTypeId?: string;
  collateralTypeDescription?: string;
  partyId?: string;
  partyName?: string;
  applicationId?: number;
  attributes?: any;
}

export class Collateral implements ICollateral {
  constructor(
    public id?: number,
    public collDetailType?: string,
    public qtySize?: number,
    public guaranteeAmount?: number,
    public guaranteeType?: string,
    public marketValue?: number,
    public guarantee_coverage?: string,
    public certificateNum?: string,
    public certificateDateFrom?: Date,
    public certificateDateThru?: Date,
    public country?: string,
    public location?: string,
    public issuerCustomer?: string,
    public bisColDetailType?: string,
    public issuingInstution?: string,
    public issInstBicCod?: string,
    public lgApplicant?: string,
    public creditRatingOffice?: string,
    public approvedCreditLinev?: string,
    public custodian?: string,
    public accOfficer?: string,
    public collateralCode?: string,
    public collBindingType?: string,
    public registrationDate?: Date,
    public contractDate?: Date,
    public releaseDate?: Date,
    public collateralOwner?: string,
    public loanCustomer?: string,
    public facilityType?: string,
    public collateralStatus?: string,
    public collateralGrading?: string,
    public bindingDate?: Date,
    public paripasuStatus?: string,
    public collCharacteristic?: string,
    public issuer?: string,
    public ratingInstitution?: string,
    public issuerRating?: string,
    public ratingDate?: Date,
    public fromDate?: Date,
    public thruDate?: Date,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public collateralTypeId?: string,
    public collateralTypeDescription?: string,
    public partyId?: string,
    public partyName?: string,
    public applicationId?: number,
    public attributes?: any
  ) {}
}
