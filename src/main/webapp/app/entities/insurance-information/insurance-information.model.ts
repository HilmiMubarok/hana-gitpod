export interface IInsuranceInformation {
  id?: number;
  agreementNumber?: string;
  dateAgreement?: Date;
  description?: string;
  name?: string;
  internalId?: string;
  internalName?: string;
  toPartyId?: string;
  notes?: string;
  fromDate?: Date;
  thruDate?: Date;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  agreementTypeId?: string;
  agreementTypeDescription?: string;
  roles?: any;
  attributes?: any;
  collateralId?: number;
  insuranceCategoryId?: number;
  insuranceCategoryDescription?: string;
  documentPolicyId?: number;
  documentPolicyDescription?: string;
  currencyId?: string;
  currencyDescription?: string;
  currencyValue?: number;
  coverageValue?: number;
  coverageValueInIDR?: number;
  bankerClause?: boolean;
  paymentStatus?: boolean;
  brokerCompany?: string;
  companyName?: string;
}

export class InsuranceInformation implements IInsuranceInformation {
  constructor(
    public id?: number,
    public agreementNumber?: string,
    public dateAgreement?: Date,
    public description?: string,
    public name?: string,
    public internalId?: string,
    public internalName?: string,
    public toPartyId?: string,
    public notes?: string,
    public fromDate?: Date,
    public thruDate?: Date,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public agreementTypeId?: string,
    public agreementTypeDescription?: string,
    public roles?: any,
    public attributes?: any,
    public collateralId?: number,
    public insuranceCategoryId?: number,
    public insuranceCategoryDescription?: string,
    public documentPolicyId?: number,
    public documentPolicyDescription?: string,
    public currencyId?: string,
    public currencyDescription?: string,
    public currencyValue?: number,
    public coverageValue?: number,
    public coverageValueInIDR?: number,
    public bankerClause?: boolean,
    public paymentStatus?: boolean,
    public brokerCompany?: string,
    public companyName?: string
  ) {
    this.attributes = {};
    this.currencyValue = 0;
    this.coverageValue = 0;
    this.coverageValueInIDR = 0;
  }
}
