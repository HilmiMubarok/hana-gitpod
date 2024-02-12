import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import * as uuid from 'uuid';

export interface ICollateralPropertyAttribute {
  id?: string;
  collateralDetailType?: string;
  certificateType?: string;
  certificateNumber?: string;
  quantitySize?: number;
  quantitySizeUomId?: string;
  expiry?: Date;
  address?: string;
  postalCode?: string;
  village?: number;
  district?: number;
  city?: number;
  province?: number;
  managementBranch?: string;
  branch?: string;
  developer?: string;
  developerSubsidyStatus?: string;
  appraisalDateInternal?: Date;
  marketValuePhysic?: number;
  marketValueIMB?: number;
  marketValueTataKota?: number;
  appraisalDateIndependent?: Date;
  instituionOfIndependent?: string;
  marketValueIndependent?: number;
  appraisalValueIMBIndependent?: number;
  accountOfficer?: string;
  accountCustomer?: string;
  bisColDetailType?: string;
  charCollateral?: string;
  charCollateralUom?: string;
  guaranteeAmount?: number;
  guaranteeAmountUomId?: string;
  guaranteeType?: string;
  guaranteeCoverage?: string;
  issInstBic?: string;
  lGApp?: string;
  issuerCustomer?: string;
  requisitionExpiry?: Date;
  referenceNumber?: string;
  amount?: number;
  approvedCreditLine?: string;
  depositBicCode?: string;
  remark?: string;
  contractAmount?: number;
  debitBlock?: string;
  custodian?: string;
  installMentTime?: number;
  issuer?: string;
  issueDate?: Date;
  issuingInstitusi?: string;
  maturityDate?: string;
  montlyInstallmentAmount?: string;
  openingDate?: Date;
  securityName?: string;
  totalFaceAmount?: string;
  unitFaceAmount?: string;
  collateralAdress?: string;
}

export class CollateralPropertyAttribute implements ICollateralPropertyAttribute {
  constructor(
    public id?: string,
    public collateralDetailType?: string,
    public certificateType?: string,
    public certificateNumber?: string,
    public quantitySize?: number,
    public quantitySizeUomId?: string,
    public expiry?: Date,
    public address?: string,
    public postalCode?: string,
    public village?: number,
    public district?: number,
    public city?: number,
    public province?: number,
    public managementBranch?: string,
    public branch?: string,
    public developer?: string,
    public developerSubsidyStatus?: string,
    public appraisalDateInternal?: Date,
    public marketValuePhysic?: number,
    public marketValueIMB?: number,
    public marketValueTataKota?: number,
    public appraisalDateIndependent?: Date,
    public instituionOfIndependent?: string,
    public marketValueIndependent?: number,
    public appraisalValueIMBIndependent?: number,
    public accountOfficer?: string,
    public accountCustomer?: string,
    public bisColDetailType?: string,
    public charCollateral?: string,
    public charCollateralUom?: string,
    public guaranteeAmount?: number,
    public guaranteeAmountUomId?: string,
    public guaranteeType?: string,
    public guaranteeCoverage?: string,
    public issInstBic?: string,
    public lGApp?: string,
    public issuerCustomer?: string,
    public requisitionExpiry?: Date,
    public referenceNumber?: string,
    public amount?: number,
    public approvedCreditLine?: string,
    public depositBicCode?: string,
    public remark?: string,
    public contractAmount?: number,
    public debitBlock?: string,
    public custodian?: string,
    public installMentTime?: number,
    public issuer?: string,
    public issueDate?: Date,
    public issuingInstitusi?: string,
    public maturityDate?: string,
    public montlyInstallmentAmount?: string,
    public openingDate?: Date,
    public securityName?: string,
    public totalFaceAmount?: string,
    public unitFaceAmount?: string,
    public collateralAdress?: string
  ) {
    this.id = uuid.v4();
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
  uomDescription?: string;
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
  appraisalDateExternal?: Date;
  appraisalDateInternal?: Date;
  appraisalExternalPartner?: string;
  total?: number;
  imbmarketVal?: number;
  tkotamarketVal?: number;
  marketValue?: number;
  percentage?: number;
  external?: boolean;
  externalName?: string;
  liquidationValue?: number;
  marketability?: string;
  marketValueOriginalAmt?: number;
  marketValueOriginalCcy?: string;
  certificateExpiryDate?: Date;
  guarantorCif?: string;
  guarantorName?: string;
  loanCustomerCif?: string;
  loanCustomerName?: string;
  guaranteeIdType?: string;
  guaranteeClass?: string;
  guaranteeCountry?: string;
  marketValueNjopCcy?: string;
  bicCode?: string;
  propertyAreaTataKota?: number;
  depositInterestRate?: number;
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
    public uomDescription?: string,
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
    public attributes?: any,
    public appraisalDateExternal?: Date,
    public appraisalDateInternal?: Date,
    public appraisalExternalPartner?: string,
    public total?: number,
    public imbmarketVal?: number,
    public tkotamarketVal?: number,
    public marketValue?: number,
    public percentage?: number,
    public external?: boolean,
    public externalName?: string,
    public liquidationValue?: number,
    public marketability?: string,
    public marketValueOriginalAmt?: number,
    public marketValueOriginalCcy?: string,
    public certificateExpiryDate?: Date,
    public guarantorCif?: string,
    public guarantorName?: string,
    public loanCustomerCif?: string,
    public loanCustomerName?: string,
    public guaranteeIdType?: string,
    public guaranteeClass?: string,
    public guaranteeCountry?: string,
    public marketValueNjopCcy?: string,
    public bicCode?: string,
    public propertyAreaTataKota?: number,
    public depositInterestRate?: number
  ) {}
}
