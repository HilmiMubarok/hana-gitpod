import { IProcessTask } from 'app/shared/model/process-task.model';
import { IPostalAddress } from '../postal-address/postal-address.model';

export interface ICollateralAttribute {
  additionalStatus?: string;
  additionalCollateralType?: string;
}

export class CollateralAttribute implements ICollateralAttribute {
  constructor(public additionalStatus?: string, public additionalCollateralType?: string) {}
}

// --------------------------------------------------------------------------------------

export interface ICollateral {
  id?: number;
  collateralNumber?: string;
  fromDate?: Date;
  thruDate?: Date;
  collateralTypeDescription?: string;
  collateralTypeId?: string;
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
  colBindingType?: string;
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
  picPhone?: number;
  bankAccountNum?: string;
  truncatedArea?: number;
  publicFacilities?: number;
  propertyUsage?: number;
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
}

export class Collateral implements ICollateral {
  constructor(
    public id?: number,
    public collateralNumber?: string,
    public fromDate?: Date,
    public thruDate?: Date,
    public collateralTypeDescription?: string,
    public collateralTypeId?: string,
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
    public colBindingType?: string,
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
    public picPhone?: number,
    public bankAccountNum?: string,
    public truncatedArea?: number,
    public publicFacilities?: number,
    public propertyUsage?: number,
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
    public attributes?: any
  ) {
    this.requisitionExpiryDate = new Date();
    this.appraisalDateIndependent = new Date();
    this.certificateDateFrom = new Date();
    this.certificateDateThru = new Date();
    this.appraisalDateIndependent = new Date();
    this.truncatedArea = 0;
    this.attributes = new CollateralAttribute();
  }
}
