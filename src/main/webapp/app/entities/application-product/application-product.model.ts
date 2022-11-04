import { IProduct } from '../product/product.model';
import * as uuid from 'uuid';

export interface IApplicationProduct {
  id?: number;
  groupCompanyId?: number;
  groupCompanyName?: string;
  amount?: number;
  tenor?: number;
  applicationId?: number;
  productId?: number;
  currencyId?: string;
  currentProduct?: IProduct;
  attributes?: any;
  uniqueKey?: string;
}

export class ApplicationProduct implements IApplicationProduct {
  constructor(
    public id?: number,
    public groupCompanyId?: number,
    public groupCompanyName?: string,
    public amount?: number,
    public tenor?: number,
    public applicationId?: number,
    public productId?: number,
    public currencyId?: string,
    public currentProduct?: IProduct,
    public attributes?: any,
    public uniqueKey?: string
  ) {
    this.uniqueKey = uuid.v4();
  }
}

export interface IApplicationProductAttribute {
  nomorUrutFasilitas?: number;
  applicationType?: string;
  facilityType?: string;
  installmentMethod?: string;
  maturity?: number;
  maturityPeriodType?: string;
  maturityDate?: Date;
  subLimit?: boolean;
  sublimitFromExistingFacility?: string;
  commitedLine?: boolean;
  currency?: string;
  kurs?: number;
  initialLimit?: number;
  outstanding?: number;
  dateOS?: Date;
  changes?: number;
  totalPlafond?: number;
  restructuredStatus?: boolean;
  restructMethod?: string;
  memoNo?: string;
  memoDate?: Date;
  keterangan?: string;
  interestRateType?: string;
  currentInterestRate?: number;
  interestRatePeriod?: string;
  interestRatePeriodType?: string;
  indexRate?: number;
  spreadOfMargin?: number;
  totalRate?: number;
  provitionFee?: number;
  provitionFeeRateAmountType?: string;
  adminFee?: number;
  adminFeeRateAmountType?: string;
  gracePeriod?: number;
  gracePeriodType?: string;
  availableLimit?: number;
  availablePeriod?: string;
  availablePeriodType?: string;
  instalmentEstimation?: number;
  principalFrequency?: number;
  principalFrequencyPeriodType?: string;
  loanPurpose?: string;
  remark?: string;
  subLimitFromExitingFacility?: string;
  indexFacilityMain?: string;
  loanType?: string;
}

export class ApplicationProductAttribute implements IApplicationProductAttribute {
  constructor(
    public nomorUrutFasilitas?: number,
    public applicationType?: string,
    public facilityType?: string,
    public installmentMethod?: string,
    public maturity?: number,
    public maturityPeriodType?: string,
    public maturityDate?: Date,
    public subLimit?: boolean,
    public sublimitFromExistingFacility?: string,
    public commitedLine?: boolean,
    public currency?: string,
    public kurs?: number,
    public initialLimit?: number,
    public outstanding?: number,
    public dateOS?: Date,
    public changes?: number,
    public totalPlafond?: number,
    public restructuredStatus?: boolean,
    public restructMethod?: string,
    public memoNo?: string,
    public memoDate?: Date,
    public keterangan?: string,
    public interestRateType?: string,
    public currentInterestRate?: number,
    public interestRatePeriod?: string,
    public interestRatePeriodType?: string,
    public indexRate?: number,
    public spreadOfMargin?: number,
    public totalRate?: number,
    public provitionFee?: number,
    public provitionFeeRateAmountType?: string,
    public adminFee?: number,
    public adminFeeRateAmountType?: string,
    public gracePeriod?: number,
    public gracePeriodType?: string,
    public availableLimit?: number,
    public availablePeriod?: string,
    public availablePeriodType?: string,
    public instalmentEstimation?: number,
    public principalFrequency?: number,
    public principalFrequencyPeriodType?: string,
    public loanPurpose?: string,
    public remark?: string,
    public subLimitFromExitingFacility?: string,
    public indexFacilityMain?: string,
    public loanType?: string
  ) {
    this.applicationType = 'Existing';
    this.facilityType = '';
    this.installmentMethod = 'Maturity Repayment';
    this.maturity = 0;
    this.maturityPeriodType = '';
    this.maturityDate = new Date();
    this.subLimit = false;
    this.sublimitFromExistingFacility = '';
    this.commitedLine = false;
    this.currency = '';
    this.kurs = 0;
    this.initialLimit = 0;
    this.outstanding = 0;
    this.dateOS = new Date();
    this.changes = 0;
    this.totalPlafond = 0;
    this.restructuredStatus = false;
    this.restructMethod = '';
    this.memoNo = '';
    (this.memoDate = new Date()), (this.keterangan = '');
    this.interestRateType = '';
    this.currentInterestRate = 0;
    this.interestRatePeriod = '';
    this.interestRatePeriodType = 'Month';
    this.indexRate = 0;
    this.spreadOfMargin = 0;
    this.totalRate = 0;
    this.provitionFee = 0;
    this.provitionFeeRateAmountType = '';
    this.adminFee = 0;
    this.adminFeeRateAmountType = '';
    this.gracePeriod = 0;
    this.gracePeriodType = '';
    this.availableLimit = 0;
    this.availablePeriod = '';
    this.availablePeriodType = '';
    this.instalmentEstimation = 0;
    this.principalFrequency = 0;
    this.principalFrequencyPeriodType = '';
    this.loanPurpose = '';
    this.remark = '';
    this.subLimitFromExitingFacility = '';
    this.indexFacilityMain = '';
    this.loanType = '';
  }
}
