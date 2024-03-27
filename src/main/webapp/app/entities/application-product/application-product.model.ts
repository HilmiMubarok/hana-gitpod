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
  adminFeeAmount?: number;
  adminFeeType?: string;
  agreementNumber?: number;
  applCondition?: string;
  applicationType?: string;
  approvalNumber?: string;
  availPeriod?: string;
  availableLimit?: number;
  categoryId?: string;
  changes?: number;
  contractAmount?: number;
  custodianFeeAmount?: number;
  custodianFeeCurrency?: string;
  custodianFeeType?: string;
  graceDays?: number;
  indexRate?: number;
  intResetFrequency?: number;
  loanCurrency?: string;
  maturityDate?: string;
  thruDateContract?: string;
  startDateContract?: string;
  outstanding?: number;
  paymentMethod?: string;
  periodType?: string;
  productCashType?: boolean;
  productCode?: string;
  productName?: string;
  productTypeId?: string;
  provisionFeeAmount?: number;
  provisionFeeType?: string;
  rateType?: string;
  rateTypeName?: string;
  restructMethod?: string;
  restructStatus?: string;
  spreadRate?: number;
  subLimit?: boolean;
  totRate?: number;
  totalPlafond?: number;
  trxDate?: Date;
  uncomitUsage?: string;
  nomorUrutFasilitas?: number;
  facilityType?: string;
  installmentMethod?: string;
  maturity?: number;
  maturityPeriodType?: string;
  sublimitFromExistingFacility?: string;
  commitedLine?: boolean;
  currency?: string;
  kurs?: number;
  initialLimit?: number;
  dateOS?: Date;
  restructuredStatus?: boolean;
  memoNo?: string;
  memoDate?: Date;
  keterangan?: string;
  interestRateType?: string;
  currentInterestRate?: number;
  interestRatePeriod?: string;
  interestRatePeriodType?: string;
  spreadOfMargin?: number;
  totalRate?: number;
  provitionFee?: number;
  provitionFeeRateAmountType?: string;
  adminFee?: number;
  adminFeeRateAmountType?: string;
  gracePeriod?: number;
  gracePeriodType?: string;
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
  disbursementCondition?: string;
  discountProposal?: string;

  // Offering Letter Field
  latePaymentFee?: string;
  paymentObligation?: string;
  earlyRepaymentPenalty?: number;
  thePrimeLandingRate?: number;
  hobis?: boolean;
  indexRateStr?: string;
  primeLandingRate?: string;
  intResetPeriod?: string;
  requiredSpread?: string;
  intResetFrequencyParam?: string;

  ftp?: string;
  ckpn?: string;
  industrySpread?: string;
  targetMargin?: string;
  normalRate?: string;
  proposedRate?: string;
  cost?: string;
  roaa?: string;

  referenceRate?: string;
  typeReferenceRateFun?: string;
  No?: number;
  expectedLoss?: string;
  subLimitFun?: boolean;
  pricingRate?: string;

  agreementDate?: Date;
  avgDiscProposalIDR?: string;
  avgDiscProposalUSD?: string;
  avgNormalRateIDR?: string;
  avgNormalRateUSD?: string;
  avgProposedRateIDR?: string;
  avgProposedRateUSD?: string;
  creditTerm?: string;
  installmentType?: string;
  totalRestructure?: number;
  jenisPenggunaId?: number;
  jenisPenggunaCode?: string;
  jenisPenggunaValue?: string;
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
    public uniqueKey?: string,
    public adminFeeAmount?: number,
    public adminFeeType?: string,
    public agreementNumber?: number,
    public applCondition?: string,
    public applicationType?: string,
    public approvalNumber?: string,
    public availPeriod?: string,
    public availableLimit?: number,
    public categoryId?: string,
    public changes?: number,
    public contractAmount?: number,
    public custodianFeeAmount?: number,
    public custodianFeeCurrency?: string,
    public custodianFeeType?: string,
    public graceDays?: number,
    public indexRate?: number,
    public intResetFrequency?: number,
    public loanCurrency?: string,
    public maturityDate?: string,
    public thruDateContract?: string,
    public startDateContract?: string,
    public outstanding?: number,
    public paymentMethod?: string,
    public periodType?: string,
    public productCashType?: boolean,
    public productCode?: string,
    public productName?: string,
    public productTypeId?: string,
    public provisionFeeAmount?: number,
    public provisionFeeType?: string,
    public rateType?: string,
    public rateTypeName?: string,
    public restructMethod?: string,
    public restructStatus?: string,
    public spreadRate?: number,
    public subLimit?: boolean,
    public totRate?: number,
    public totalPlafond?: number,
    public trxDate?: Date,
    public uncomitUsage?: string,
    public facilityType?: string,
    public installmentMethod?: string,
    public maturity?: number,
    public maturityPeriodType?: string,
    public sublimitFromExistingFacility?: string,
    public commitedLine?: boolean,
    public currency?: string,
    public kurs?: number,
    public initialLimit?: number,
    public dateOS?: Date,
    public restructuredStatus?: boolean,
    public memoNo?: string,
    public memoDate?: Date,
    public keterangan?: string,
    public interestRateType?: string,
    public currentInterestRate?: number,
    public interestRatePeriod?: string,
    public interestRatePeriodType?: string,
    public spreadOfMargin?: number,
    public totalRate?: number,
    public provitionFee?: number,
    public provitionFeeRateAmountType?: string,
    public adminFee?: number,
    public adminFeeRateAmountType?: string,
    public gracePeriod?: number,
    public gracePeriodType?: string,
    public availablePeriod?: string,
    public availablePeriodType?: string,
    public instalmentEstimation?: number,
    public principalFrequency?: number,
    public principalFrequencyPeriodType?: string,
    public loanPurpose?: string,
    public remark?: string,
    public subLimitFromExitingFacility?: string,
    public indexFacilityMain?: string,
    public loanType?: string,
    public disbursementCondition?: string,
    public discountProposal?: string,

    // Offering Letter Field
    public latePaymentFee?: string,
    public paymentObligation?: string,
    public earlyRepaymentPenalty?: number,
    public thePrimeLandingRate?: number,
    public hobis?: boolean,
    public indexRateStr?: string,
    public primeLandingRate?: string,
    public intResetPeriod?: string,
    public requiredSpread?: string,
    public intResetFrequencyParam?: string,
    public ftp?: string,
    public ckpn?: string,
    public industrySpread?: string,
    public targetMargin?: string,
    public normalRate?: string,
    public proposedRate?: string,
    public cost?: string,
    public roaa?: string,
    public referenceRate?: string,
    public typeReferenceRateFun?: string,
    public No?: number,
    public expectedLoss?: string,
    public subLimitFun?: boolean,
    public pricingRate?: string,
    public agreementDate?: Date,
    public avgDiscProposalIDR?: string,
    public avgDiscProposalUSD?: string,
    public avgNormalRateIDR?: string,
    public avgNormalRateUSD?: string,
    public avgProposedRateIDR?: string,
    public avgProposedRateUSD?: string,
    public creditTerm?: string,
    public installmentType?: string,
    public totalRestructure?: number,
    public jenisPenggunaId?: number,
    public jenisPenggunaCode?: string,
    public jenisPenggunaValue?: string
  ) {
    this.uniqueKey = uuid.v4();
    this.applicationType = 'New';
    this.facilityType = '';
    this.installmentMethod = 'Maturity Repayment';
    this.maturity = 0;
    this.maturityPeriodType = '';
    this.subLimit = false;
    this.sublimitFromExistingFacility = '';
    this.commitedLine = false;
    this.currencyId = null;
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
    this.disbursementCondition = '';
    this.discountProposal = '';
    this.periodType = '';
    this.provisionFeeAmount = 0;

    // Offering letter Field
    this.latePaymentFee = '';
    this.paymentObligation = '';
    this.earlyRepaymentPenalty = 0;
    this.thePrimeLandingRate = 0;
    this.indexRateStr = '';
    this.primeLandingRate = '';
    this.indexRateStr = '';
    this.rateTypeName = '';
    this.intResetFrequency = 0;
    this.intResetPeriod = 'Month';
    this.intResetFrequencyParam = 'M';
    this.tenor = 0;
    this.adminFeeAmount = 0;
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
  disbursementCondition?: string;
  discountProposal?: string;

  // Offering Letter Field
  latePaymentFee?: string;
  paymentObligation?: string;
  earlyRepaymentPenalty?: number;
  thePrimeLandingRate?: number;
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
    public loanType?: string,
    public disbursementCondition?: string,
    public discountProposal?: string,
    // Offering Letter Field
    public latePaymentFee?: string,
    public paymentObligation?: string,
    public earlyRepaymentPenalty?: number,
    public thePrimeLandingRate?: number
  ) {
    this.applicationType = 'New';
    this.facilityType = '';
    this.installmentMethod = 'Maturity Repayment';
    this.maturity = 0;
    this.maturityPeriodType = '';
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
    this.disbursementCondition = '';
    this.discountProposal = '';

    // Offering letter Field
    this.latePaymentFee = '';
    this.paymentObligation = '';
    this.earlyRepaymentPenalty = 0;
    this.thePrimeLandingRate = 0;
  }
}
