export interface ICollateral {
  numberId?: number;
  collDetailType?: string;
  qtySize?: number;
  guaranteeAmount?: number;
  marketValue?: number;
  guaranteType?: string;
  guaranteeCoverage?: string;
  certificateNum?: string;
  certificateDateFrom?: Date;
  certificateDateThru?: Date;
  country?: string;
  location?: string;
  issuerCustomer?: string;
  bisColDetailType?: string;
  issuingInstution?: string;
  issInstBicCod?: string;
  lgApplecant?: string;
  creditRatingOffice?: string;
  approvedCreditLine?: string;

  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  collateralTypeDescription?: string;
  collateralTypeId?: string;
  partyName?: string;
  partyId?: string;
  applicationId?: number;
  attributes?: any;

  // Baru
  custodian?: string;
  managementBranch?: object;
  accOfficer?: number;
  collateralId?: string;
  collateralCode?: string;
  colBindingType?: string;
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

  machineName?: string;
  machineDocType?: string;
  machineDocNum?: string;
  machineDate?: Date;
  machineDateFrom?: Date;
  machineAmount?: string;
  machineMerk?: string;
  machineMadeBy?: string;
  machineYear?: number;
  machineModelType?: string;
  machineType?: string;
  machineMfgDate?: Date;
  machineSpec?: string;
  machineCondition?: string;
  machineNotes?: string;

  bpkbNum?: string;
  bpkbName?: string;
  vehNum?: string;
  vehYear?: number;
  stnkNum?: string;
  chassisNum?: string;
  vehMachineNum?: string;
  vehInvNum?: string;
  vehUsedBy?: string;
  vehBrand?: string;
  vehType?: string;
  vehCategory?: string;
  vehModel?: string;
  vehCylinder?: string;
  vehColour?: string;
  vehFuel?: string;
  vehtransmission?: string;
  vehWheelsTtl?: string;
  vehUnitCond?: string;
  vehNotes?: string;
}

export class Collateral implements ICollateral {
  constructor(
    public numberId?: number,
    public coolDetailType?: string,
    public qtySize?: number,
    public guaranteeAmount?: number,
    public marketValue?: number,
    public guaranteType?: string,
    public guaranteeCoverage?: string,
    public certificateNum?: string,
    public certificateDateFrom?: Date,
    public certificateDateThru?: Date,
    public country?: string,
    public location?: string,
    public issuerCustomer?: string,
    public bisColDetailType?: string,
    public issuingInstution?: string,
    public issInstBicCod?: string,
    public lgApplecant?: string,
    public creditRatingOffice?: string,
    public approvedCreditLine?: string,

    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public collateralTypeDescription?: string,
    public collateralTypeId?: string,
    public partyName?: string,
    public partyId?: string,
    public applicationId?: number,
    public attributes?: any,

    public custodian?: string,
    public managementBranch?: object,
    public accOfficer?: number,
    public collateralId?: string,
    public collateralCode?: string,
    public colBindingType?: string,
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

    public machineName?: string,
    public machineDocType?: string,
    public machineDocNum?: string,
    public machineDate?: Date,
    public machineDateFrom?: Date,
    public machineAmount?: string,
    public machineMerk?: string,
    public machineMadeBy?: string,
    public machineYear?: number,
    public machineModelType?: string,
    public machineType?: string,
    public machineMfgDate?: Date,
    public machineSpec?: string,
    public machineCondition?: string,
    public machineNotes?: string,

    public bpkbNum?: string,
    public bpkbName?: string,
    public vehNum?: string,
    public vehYear?: number,
    public stnkNum?: string,
    public chassisNum?: string,
    public vehMachineNum?: string,
    public vehInvNum?: string,
    public vehUsedBy?: string,
    public vehBrand?: string,
    public vehType?: string,
    public vehCategory?: string,
    public vehModel?: string,
    public vehCylinder?: string,
    public vehColour?: string,
    public vehFuel?: string,
    public vehtransmission?: string,
    public vehWheelsTtl?: string,
    public vehUnitCond?: string,
    public vehNotes?: string
  ) {}
}
