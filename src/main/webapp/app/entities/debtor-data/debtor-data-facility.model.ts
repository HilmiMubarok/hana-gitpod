export interface IDebtorDataFacility {
  id?: number;
  partyId?: string;
  approvalNumber?: string;
  agreementNumber?: string;
  categoryId?: string;
  productId?: number;
  productCode?: string;
  productName?: string;
  productTypeId?: string;
  productCashType?: true;
  baseCurrency?: string;
  loanCurrency?: string;
  outstanding?: number;
  availableLimit?: number;
  maturityDate?: Date;
  intResetFrequency?: number;
  intResetFrequencyParam?: string;
  intResetPeriod?: string;
  paymentMethod?: string;
  indexRate?: number;
  uncomitUsage?: string;
  contractAmount?: number;
  rateType?: string;
  rateTypeName?: string;
  trxDate?: Date;
  totRate?: number;
  spreadRate?: number;
  custodianFeeCurrency?: string;
  custodianFeeAmount?: number;
  custodianFeeType?: string;
  adminFeeAmount?: number;
  adminFeeType?: string;
  provisionFeeAmount?: number;
  provisionFeeType?: string;
  graceDays?: number;
  availPeriod?: string;
  restructStatus?: string;
  restructMethod?: string;
  applCondition?: string;
  tenor?: number;
  periodType?: string;
  subLimit?: boolean;
}

export class DebtorDataFacility implements DebtorDataFacility {
  constructor(
    public id?: number,
    public partyId?: string,
    public approvalNumber?: string,
    public agreementNumber?: string,
    public categoryId?: string,
    public productId?: number,
    public productCode?: string,
    public productName?: string,
    public productTypeId?: string,
    public productCashType?: true,
    public baseCurrency?: string,
    public loanCurrency?: string,
    public outstanding?: number,
    public availableLimit?: number,
    public maturityDate?: Date,
    public intResetFrequency?: number,
    public intResetFrequencyParam?: string,
    public intResetPeriod?: string,
    public paymentMethod?: string,
    public indexRate?: number,
    public uncomitUsage?: string,
    public contractAmount?: number,
    public rateType?: string,
    public rateTypeName?: string,
    public trxDate?: Date,
    public totRate?: number,
    public spreadRate?: number,
    public custodianFeeCurrency?: string,
    public custodianFeeAmount?: number,
    public custodianFeeType?: string,
    public adminFeeAmount?: number,
    public adminFeeType?: string,
    public provisionFeeAmount?: number,
    public provisionFeeType?: string,
    public graceDays?: number,
    public availPeriod?: string,
    public restructStatus?: string,
    public restructMethod?: string,
    public applCondition?: string,
    public tenor?: number,
    public periodType?: string,
    public subLimit?: boolean
  ) {}
}
