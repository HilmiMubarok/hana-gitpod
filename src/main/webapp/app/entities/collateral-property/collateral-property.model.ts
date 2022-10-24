import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import * as uuid from 'uuid';

export interface ICollateralPropertyAttribute {
  id?: string;
  collateralDetailType?: string;
}

export interface ICollateralPropertyGuaranteeAttribute extends ICollateralPropertyAttribute {
  guaranteeQuantitySize?: number;
  guaranteeQuantitySizeUomId?: string;
  guaranteeAmount?: number;
  guaranteeAmountUomId?: string;
  guaranteeMarketValue?: number;
  guaranteeMarketValueUomId?: string;
  guaranteeType?: string;
  guaranteeCoverage?: string;
  guaranteeCertNumber?: string;
  guaranteeCertDate?: Date;
  guaranteeCertExpiry?: Date;
  guaranteeRequisitionExpiry?: Date;
  guaranteeManagementBranch?: string;
  guaranteeBranch?: string;
  guaranteeCountry?: number;
  guaranteeAddress?: string;
  guaranteeIssuer?: string;
  guaranteeBISColDetailType?: string;
  guaranteeIssuing?: string;
  guaranteeISS?: string;
  guaranteeLG?: string;
  guaranteeCreditLine?: number;
  guaranteeCreditLineUomId?: string;
  guaranteeAccountOfficer?: string;
  guaranteeCharacteristic?: string;
  guaranteeCharacteristicUom?: string;
}

export class CollateralPropertyGuaranteeAttribute implements ICollateralPropertyGuaranteeAttribute {
  constructor(
    public id?: string,
    public collateralDetailType?: string,
    public guaranteeQuantitySize?: number,
    public guaranteeQuantitySizeUomId?: string,
    public guaranteeAmount?: number,
    public guaranteeAmountUomId?: string,
    public guaranteeMarketValue?: number,
    public guaranteeMarketValueUomId?: string,
    public guaranteeType?: string,
    public guaranteeCoverage?: string,
    public guaranteeCertNumber?: string,
    public guaranteeCertDate?: Date,
    public guaranteeCertExpiry?: Date,
    public guaranteeRequisitionExpiry?: Date,
    public guaranteeManagementBranch?: string,
    public guaranteeBranch?: string,
    public guaranteeCountry?: number,
    public guaranteeAddress?: string,
    public guaranteeIssuer?: string,
    public guaranteeBISColDetailType?: string,
    public guaranteeIssuing?: string,
    public guaranteeISS?: string,
    public guaranteeLG?: string,
    public guaranteeCreditLine?: number,
    public guaranteeCreditLineUomId?: string,
    public guaranteeAccountOfficer?: string,
    public guaranteeCharacteristic?: string,
    public guaranteeCharacteristicUom?: string
  ) {
    this.id = uuid.v4();
    this.guaranteeQuantitySizeUomId = '';
    this.guaranteeAmountUomId = '';
    this.guaranteeCreditLineUomId = '';
    this.guaranteeMarketValueUomId = '';
    this.guaranteeCertDate = new Date();
    this.guaranteeCertExpiry = new Date();
    this.guaranteeRequisitionExpiry = new Date();
    this.guaranteeCharacteristicUom = '';
  }
}

// ------------------------------------------------------------------------------------
export interface ICollateralPropertyOtherAttribute extends ICollateralPropertyAttribute {
  otherReferenceNumber?: string;
  otherQuantitySize?: number;
  otherQuantitySizeUomId?: string;
  otherMarketValue?: string;
  otherMarketValueIMB?: number;
  otherMarketValueIMBUomId?: string;
  otherExpiry?: string;
  otherIssuer?: string;
  otherAddress?: string;
  otherCountry?: number;
  otherProvince?: number;
  otherCity?: number;
  otherDistrict?: number;
  otherVillage?: number;
  otherManagementBranch?: string;
  otherAccountOfficer?: string;
}

export class CollateralPropertyOtherAttribute implements ICollateralPropertyAttribute {
  constructor(
    public id?: string,
    public collateralDetailType?: string,
    public otherReferenceNumber?: string,
    public otherQuantitySize?: number,
    public otherQuantitySizeUomId?: string,
    public otherMarketValue?: string,
    public otherMarketValueIMB?: number,
    public otherMarketValueIMBUomId?: string,
    public otherExpiry?: string,
    public otherIssuer?: string,
    public otherAddress?: string,
    public otherCountry?: number,
    public otherProvince?: number,
    public otherCity?: number,
    public otherDistrict?: number,
    public otherVillage?: number,
    public otherManagementBranch?: string,
    public otherAccountOfficer?: string
  ) {
    this.id = uuid.v4();
  }
}

// ------------------------------------------------------------------------------------

export interface ICollateralPropertyRealEstateAttribute extends ICollateralPropertyAttribute {
  realestateCertificateType?: string;
  realestateCertificateNumber?: string;
  realestateQuantitySize?: number;
  realestateQuantitySizeUomId?: string;
  realestateExpiry?: Date;
  realestateAddress?: Date;
  realestatePostalCode?: string;
  realestateVillage?: number;
  realestateDistrict?: number;
  realestateCity?: number;
  realestateProvince?: number;
  realestateManagementBranch?: string;
  realestateBranch?: string;
  realestateDeveloper?: string;
  realestateDeveloperSubsidyStatus?: string;
  realestateAppraisalDateInternal?: Date;
  realestateMarketValuePhysic?: number;
  realestateMarketValueIMB?: number;
  realestateMarketValueTataKota?: number;
  realestateAppraisalDateIndependent?: Date;
  realestateInstituionOfIndependent?: string;
  realestateMarketValueIndependent?: number;
  realestateAppraisalValueIMBIndependent?: number;
  realestateAccountOfficer?: string;
}

export class CollateralPropertyRealEstateAttribute implements ICollateralPropertyRealEstateAttribute {
  constructor(
    public id?: string,
    public collateralDetailType?: string,
    public realestateCertificateType?: string,
    public realestateCertificateNumber?: string,
    public realestateQuantitySize?: number,
    public realestateQuantitySizeUomId?: string,
    public realestateExpiry?: Date,
    public realestateAddress?: Date,
    public realestatePostalCode?: string,
    public realestateVillage?: number,
    public realestateDistrict?: number,
    public realestateCity?: number,
    public realestateProvince?: number,
    public realestateManagementBranch?: string,
    public realestateBranch?: string,
    public realestateDeveloper?: string,
    public realestateDeveloperSubsidyStatus?: string,
    public realestateAppraisalDateInternal?: Date,
    public realestateMarketValuePhysic?: number,
    public realestateMarketValueIMB?: number,
    public realestateMarketValueTataKota?: number,
    public realestateAppraisalDateIndependent?: Date,
    public realestateInstituionOfIndependent?: string,
    public realestateMarketValueIndependent?: number,
    public realestateAppraisalValueIMBIndependent?: number,
    public realestateAccountOfficer?: string
  ) {
    this.id = uuid.v4();
  }
}

// ------------------------------------------------------------------------------------

export interface ICollateralPropertySecuritiesAttribute extends ICollateralPropertyAttribute {
  securitiesName?: string;
  securitiesQuantitySize?: number;
  securitiesQuantitySizeUomId?: string;
  securitiesUnitFaceAmount?: number;
  securitiesTotalFaceAmount?: number;
  securitiesMarketValuePhysic?: number;
  securitiesMarketValueIMB?: number;
  securitiesIssueDate?: Date;
  securitiesMaturity?: Date;
  securitiesIssuer?: string;
  securitiesAddress?: string;
  securitiesCountry?: number;
  securitiesManagementBranch?: string;
  securitiesCustodian?: string;
  securitiesAccountOfficer?: string;
}

export class CollateralPropertySecuritiesAttribute implements ICollateralPropertySecuritiesAttribute {
  constructor(
    public id?: string,
    public collateralDetailType?: string,
    public securitiesName?: string,
    public securitiesQuantitySize?: number,
    public securitiesQuantitySizeUomId?: string,
    public securitiesUnitFaceAmount?: number,
    public securitiesTotalFaceAmount?: number,
    public securitiesMarketValuePhysic?: number,
    public securitiesMarketValueIMB?: number,
    public securitiesIssueDate?: Date,
    public securitiesMaturity?: Date,
    public securitiesIssuer?: string,
    public securitiesAddress?: string,
    public securitiesCountry?: number,
    public securitiesManagementBranch?: string,
    public securitiesCustodian?: string,
    public securitiesAccountOfficer?: string
  ) {
    this.id = uuid.v4();
    this.securitiesIssueDate = new Date();
    this.securitiesMaturity = new Date();
    this.securitiesQuantitySizeUomId = '';
    this.securitiesCountry = null;
  }
}

// ------------------------------------------------------------------------------------

export interface ICollateralPropertyDepositAttribute extends ICollateralPropertyAttribute {
  depositCurrency?: string;
  depositCertNumber?: string;
  depositCertName?: string;
  depositCertCreatedDate?: Date;
  depositAmount?: number;
  depositContractAmount?: number;
  depositBank?: string;
  depositManagementBranch?: string;
  depositAddress?: string;
  depositMarketValue?: number;
  depositMaturityDate?: Date;
  depositInstallmentAmount?: number;
  depositInstallmentTime?: number;
  depositAccountOfficer?: string;
  depositAccountCustomer?: string;
  depositQuantitySize?: number;
  depositQuantitySizeUomId?: string;
  depositIssuingInstituion?: string;
  depositBicCode?: string;
  depositDebitBlock?: string;
  depositCountry?: number;
}

export class CollateralPropertyDepositAttribute implements ICollateralPropertyDepositAttribute {
  constructor(
    public id?: string,
    public collateralDetailType?: string,
    public depositCurrency?: string,
    public depositCertNumber?: string,
    public depositCertName?: string,
    public depositCertCreatedDate?: Date,
    public depositAmount?: number,
    public depositContractAmount?: number,
    public depositBank?: string,
    public depositManagementBranch?: string,
    public depositAddress?: string,
    public depositMarketValue?: number,
    public depositInstallmentAmount?: number,
    public depositInstallmentTime?: number,
    public depositMaturityDate?: Date,
    public depositAccountOfficer?: string,
    public depositAccountCustomer?: string,
    public depositQuantitySize?: number,
    public depositQuantitySizeUomId?: string,
    public depositIssuingInstituion?: string,
    public depositBicCode?: string,
    public depositDebitBlock?: string,
    public depositCountry?: number
  ) {
    this.id = uuid.v4();
    this.depositCurrency = '';
    this.depositManagementBranch = '';
    this.depositCountry = null;
    this.depositCertCreatedDate = new Date();
    this.depositMaturityDate = new Date();
  }
}

// ---------------------------------------------------------------------------------

export interface ICollateralProperty {
  id?: number;
  propertyType?: CollateralPropertyType;
  description?: string;
  partyId?: string;
  collateralId?: number;
  applicationId?: number;
  appraisalId?: number;
  collPropertyType?: string;
  uomId?: string;
  propertyPercentageIMB?: number;
  propertyMarketValueIMBPerMeter?: number;
  propertyMarketValueIMB?: number;
  propertyPercentageTataKota?: number;
  propertyMarketValueTataKotaPerMeter?: number;
  propertyMarketValueTataKota?: number;
  propertyPercentage?: number;
  propertyMarketValuePerMeter?: number;
  propertyMarketValue?: number;
  vehicleMarketValue?: number;
  vehiclePercentage?: number;
  buildingFac?: string;
  buildingSpec?: string;
  floorNo?: number;
  buildingAreaTtl?: number;
  construction?: string;
  foundation?: string;
  wall?: string;
  flooring?: string;
  ceiling?: string;
  roofTruss?: string;
  roof?: string;
  imb?: string;
  imbDate?: Date;
  storeyTtl?: string;
  imbArea?: number;
  certificateNumber?: string;
  owner?: string;
  dateOfIssue?: Date;
  dueDate?: Date;
  surveyCertificateNumber?: string;
  landSizePerCertificate?: number;
  machineName?: string;
  machineDocType?: string;
  machineDocNum?: string;
  machineDate?: Date;
  machineDateFrom?: Date;
  machineFrom?: string;
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
  machinePercentage?: number;
  machineMarketValue?: number;
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
  attributes?: any;
}

export class CollateralProperty implements ICollateralProperty {
  constructor(
    public id?: number,
    public propertyType?: CollateralPropertyType,
    public description?: string,
    public partyId?: string,
    public collateralId?: number,
    public appraisalId?: number,
    public collPropertyType?: string,
    public uomId?: string,
    public propertyPercentageIMB?: number,
    public propertyMarketValueIMBPerMeter?: number,
    public propertyMarketValueIMB?: number,
    public propertyPercentageTataKota?: number,
    public propertyMarketValueTataKotaPerMeter?: number,
    public propertyMarketValueTataKota?: number,
    public propertyPercentage?: number,
    public propertyMarketValuePerMeter?: number,
    public propertyMarketValue?: number,
    public buildingFac?: string,
    public buildingSpec?: string,
    public floorNo?: number,
    public buildingAreaTtl?: number,
    public construction?: string,
    public foundation?: string,
    public wall?: string,
    public flooring?: string,
    public ceiling?: string,
    public roofTruss?: string,
    public roof?: string,
    public imb?: string,
    public imbDate?: Date,
    public storeyTtl?: string,
    public imbArea?: number,
    public certificateNumber?: string,
    public owner?: string,
    public dateOfIssue?: Date,
    public dueDate?: Date,
    public landSizePerCertificate?: number,
    public surveyCertificateNumber?: string,
    public machineName?: string,
    public machineDocType?: string,
    public machineDocNum?: string,
    public machineDate?: Date,
    public machineDateFrom?: Date,
    public machineFrom?: string,
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
    public machineValue?: number,
    public machineMarketValue?: number,
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
    public vehNotes?: string,
    public vehicleMarketValue?: number,
    public vehiclePercentage?: number,
    public attributes?: any
  ) {}
}
