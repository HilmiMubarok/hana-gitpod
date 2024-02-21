import { IProcessTask } from 'app/shared/model/process-task.model';
import * as uuid from 'uuid';
import { IPostalAddress, PostalAddress } from '../postal-address/postal-address.model';

export interface ICollateralLandAttribute {
  id?: string;
  certNumber?: string;
  certName?: string;
  certIssueDate?: Date;
  certDueDate?: Date;
  certGSNumber?: string;
  certArea?: number;
}

export class CollateralLandAttribute {
  constructor(
    public id?: string,
    public certNumber?: string,
    public certName?: string,
    public certIssueDate?: Date,
    public certDueDate?: Date,
    public certGSNumber?: string,
    public certArea?: number
  ) {
    this.id = uuid.v4();
    this.certArea = 0;
  }
}

// --------------------------------------------------------------------------------------

export interface ICollateralAttribute {
  id?: string;
  additionalStatus?: string;
  collateralTypeDetail?: string;
  buildingFacElectricity?: string;
  buildingFacTelephone?: string;
  buildingFacAc?: string;
  buildingFacWaterHeater?: string;
  buildingFacCleanWater?: string;
  additionalCollateralType?: string;
  bindingValue?: number;
  mappingStatus?: string;
  collateralProposePricing?: string;
  collateralCode?: string;
  landCertificates?: ICollateralLandAttribute[];
  crossCollateral?: string;
}

export class CollateralAttribute implements ICollateralAttribute {
  constructor(
    public id?: string,
    public additionalStatus?: string,
    public bindingValue?: number,
    public collateralTypeDetail?: string,
    public buildingFacElectricity?: string,
    public buildingFacTelephone?: string,
    public buildingFacAc?: string,
    public buildingFacWaterHeater?: string,
    public buildingFacCleanWater?: string,
    public mappingStatus?: string,
    public crossCollateral?: string,
    public collateralCode?: string,
    public collateralProposePricing?: string,
    public landCertificates?: ICollateralLandAttribute[]
  ) {
    this.id = uuid.v4();
    this.buildingFacAc = 'no';
    this.buildingFacCleanWater = 'no';
    this.buildingFacElectricity = 'no';
    this.buildingFacTelephone = 'no';
    this.buildingFacWaterHeater = 'no';
    this.landCertificates = new Array<ICollateralLandAttribute>();
    this.mappingStatus = 'no';
    this.crossCollateral = 'no';
  }
}

// --------------------------------------------------------------------------------------

export interface ICollateral {
  id?: number;
  collateralNumber?: string;
  fromDate?: Date;
  thruDate?: Date;
  collateralTypeDescription?: string;
  collateralTypeId?: string;
  collateralTypeAppraise?: boolean;
  partyName?: string;
  partyId?: string;
  applicationId?: number;
  applicationName?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  collDetailType?: string;
  qtySize?: number;
  guaranteeAmount?: number;
  guaranteType?: string;
  marketValue?: number;
  marketValueM2?: number;
  marketValueTKotaM2?: number;
  marketValueImbM2?: number;
  percentageImb?: number;
  percentageTKota?: number;
  marketValueTataKota?: number;
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
  custodian?: string;
  accOfficer?: number;
  collateralCode?: string;
  collBindingType?: string;
  registrationDate?: Date;
  contractDate?: Date;
  releaseDate?: Date;
  collateralOwner?: string;
  loanCustomer?: string;
  facilityType?: string;
  collateralGrading?: string;
  percentage?: number;
  bindingDate?: Date;
  paripasuStatus?: string;
  collCharacteristic?: string;
  issuer?: string;
  ratingInstitution?: string;
  issuerRating?: string;
  ratingDate?: Date;
  picName?: string;
  picPhone?: string;
  bankAccountNum?: string;
  truncatedArea?: number;
  publicFacilities?: number;
  propertyUsage?: string;
  landShape?: string;
  landElevation?: number;
  roadWidth?: number;
  unitCondition?: string;
  inhabitedBy?: string;
  landPosition?: string;
  facingDirection?: string;
  madeWith?: string;
  objEnvironment?: string;
  leftSide?: string;
  rightSide?: string;
  frontSide?: string;
  backSide?: string;
  colPhotoCategory?: string;
  colPhoto?: string;
  collateralId?: string;
  remark?: string;
  appraisalDateInternal?: string;
  appraisalDateIndependent?: Date;
  marketValueImb?: number;
  marketValueIndependent?: number;
  institutionIndependent?: string;
  appraisalImbIndependent?: string;
  certificateType?: string;
  managementBranch?: string;
  branch?: string;
  devProjejctName?: string;
  devSubsidyStatus?: string;
  marketValueNjopCcy?: string;
  marketValueNjopAmt?: number;
  developerCompany?: string;
  appraisalValueImbIndependent?: number;
  accountCustCif?: string;
  accountCustName?: string;
  amount?: number;
  contractAmount?: number;
  quantity?: number;
  monthlyInstallmentAmount?: number;
  installmentTime?: number;
  openingDate?: Date;
  maturityDate?: Date;
  debitBlock?: string;
  securityName?: string;
  unitFaceAmount?: number;
  ttlFaceAmount?: number;
  issueDate?: Date;
  maturity?: string;
  issuingInstitution?: string;
  requisitionExpiryDate?: Date;
  refNo?: string;
  surveyCompanyId?: number;
  surveyCompanyName?: string;
  collateralAddress?: IPostalAddress;
  tasks?: IProcessTask;
  attributes?: any;
  liquidationValueMaping?: number;
  marketValueMaping?: number;
  dataSource?: string;
  occupancy?: string;
  collateralTypeInsurance?: boolean;
  collateralOwnerCif?: string;
}

export class Collateral implements ICollateral {
  constructor(
    public id?: number,
    public collateralNumber?: string,
    public fromDate?: Date,
    public thruDate?: Date,
    public collateralTypeDescription?: string,
    public collateralTypeId?: string,
    public collateralTypeAppraise?: boolean,
    public partyName?: string,
    public partyId?: string,
    public applicationId?: number,
    public applicationName?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public collDetailType?: string,
    public qtySize?: number,
    public guaranteeAmount?: number,
    public guaranteType?: string,
    public marketValue?: number,
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
    public custodian?: string,
    public accOfficer?: number,
    public collateralCode?: string,
    public collBindingType?: string,
    public registrationDate?: Date,
    public contractDate?: Date,
    public releaseDate?: Date,
    public collateralOwner?: string,
    public loanCustomer?: string,
    public facilityType?: string,
    public collateralGrading?: string,
    public bindingDate?: Date,
    public paripasuStatus?: string,
    public collCharacteristic?: string,
    public issuer?: string,
    public ratingInstitution?: string,
    public issuerRating?: string,
    public ratingDate?: Date,
    public picName?: string,
    public picPhone?: string,
    public bankAccountNum?: string,
    public truncatedArea?: number,
    public publicFacilities?: number,
    public propertyUsage?: string,
    public landShape?: string,
    public landElevation?: number,
    public roadWidth?: number,
    public unitCondition?: string,
    public inhabitedBy?: string,
    public landPosition?: string,
    public facingDirection?: string,
    public madeWith?: string,
    public objEnvironment?: string,
    public leftSide?: string,
    public rightSide?: string,
    public frontSide?: string,
    public backSide?: string,
    public colPhotoCategory?: string,
    public colPhoto?: string,
    public collateralId?: string,
    public remark?: string,
    public appraisalDateInternal?: string,
    public appraisalDateIndependent?: Date,
    public marketValueImb?: number,
    public marketValueIndependent?: number,
    public institutionIndependent?: string,
    public appraisalImbIndependent?: string,
    public certificateType?: string,
    public managementBranch?: string,
    public branch?: string,
    public devProjejctName?: string,
    public devSubsidyStatus?: string,
    public percentage?: number,
    public marketValueTataKota?: number,
    public marketValueNjopCcy?: string,
    public marketValueNjopAmt?: number,
    public developerCompany?: string,
    public appraisalValueImbIndependent?: number,
    public accountCustCif?: string,
    public accountCustName?: string,
    public amount?: number,
    public contractAmount?: number,
    public quantity?: number,
    public monthlyInstallmentAmount?: number,
    public installmentTime?: number,
    public openingDate?: Date,
    public maturityDate?: Date,
    public debitBlock?: string,
    public securityName?: string,
    public unitFaceAmount?: number,
    public ttlFaceAmount?: number,
    public issueDate?: Date,
    public maturity?: string,
    public issuingInstitution?: string,
    public requisitionExpiryDate?: Date,
    public refNo?: string,
    public surveyCompanyId?: number,
    public surveyCompanyName?: string,
    public collateralAddress?: IPostalAddress,
    public tasks?: IProcessTask,
    public attributes?: any,
    public liquidationValueMaping?: number,
    public marketValueMaping?: number,
    public dataSource?: string,
    public occupancy?: string,
    public collateralTypeInsurance?: boolean,
    public collateralOwnerCif?: string
  ) {
    this.requisitionExpiryDate = new Date();
    this.appraisalDateIndependent = new Date();
    this.certificateDateFrom = new Date();
    this.certificateDateThru = new Date();
    this.appraisalDateIndependent = new Date();
    this.truncatedArea = 0;
    this.attributes = new CollateralAttribute();
    this.collateralAddress = new PostalAddress();
    this.statusId = 'NEW';
  }
}

export interface ICollateralInfoAfter {
  id?: number;
  collateralType?: string;
  mvInternal?: number;
  lvInternal?: number;
}

export class CollateralInfoAfter implements ICollateralInfoAfter {
  constructor(public id?: number, public collateralType?: string, public mvInternal?: number, public lvInternal?: number) {}
}
