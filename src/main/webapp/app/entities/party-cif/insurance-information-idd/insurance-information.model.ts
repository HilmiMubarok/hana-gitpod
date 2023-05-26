import { String } from 'lodash';

export interface IInsurance {
  applicantCode?: string;
  collateralId?: number;
  applicantName?: string;
  bankerClauseStatus?: string;
  brokerCompany?: string;
  collateralType?: string;
  collateralRefNo?: string;
  dataSource?: string;
  expiryDate?: string;
  id?: number;
  insuranceAmount?: number;
  insuranceCompany?: string;
  insuranceCurrency?: string;
  insuranceNo?: string;
  insurancePolicyNo?: string;
  insuranceType?: string;
  insuredDate?: Date;
  lastCreatedDate?: Date;
  lastModifiedDate?: Date;
  paymentStatus?: string;
  pledgeDate?: Date;
  policyDocName?: string;
  remark?: string;
}

export class Insurance implements IInsurance {
  constructor(
    public applicantCode?: string,
    public collateralId?: number,
    public applicantName?: string,
    public bankerClauseStatus?: string,
    public brokerCompany?: string,
    public collateralType?: string,
    public collateralRefNo?: string,
    public dataSource?: string,
    public expiryDate?: string,
    public id?: number,
    public insuranceAmount?: number,
    public insuranceCompany?: string,
    public insuranceCurrency?: string,
    public insuranceNo?: string,
    public insurancePolicyNo?: string,
    public insuranceType?: string,
    public insuredDate?: Date,
    public lastCreatedDate?: Date,
    public lastModifiedDate?: Date,
    public paymentStatus?: string,
    public pledgeDate?: Date,
    public policyDocName?: string,
    public remark?: string
  ) {}
}
