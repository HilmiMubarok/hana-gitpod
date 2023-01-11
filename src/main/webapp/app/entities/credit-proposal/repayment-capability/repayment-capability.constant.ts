export interface IRepaymentCapability {
  id?: string;
  detail?: IRepaymentCapability;
}

export interface IRepaymentCapabilityDetail {
  id?: string;
  existingFs?: number;
  existingCreditMutation?: number;
  currentProposalFs?: number;
  currentProposalCredit?: number;
  monthlySalesEbit?: number;
  averageBalance?: number;
  creditMutationMargin?: number;
  bufferFs?: number;
  bufferAvverage?: number;
  bufferCredit?: number;
  bufferIncomeFs?: number;
  bufferIncomeAverage?: number;
  bufferIncomeCredit?: number;
}

export class RepaymentCapabilityDetail implements IRepaymentCapabilityDetail {
  constructor(
    public id?: string,
    public existingFs?: number,
    public existingCreditMutation?: number,
    public currentProposalFs?: number,
    public currentProposalCredit?: number,
    public monthlySalesEbit?: number,
    public averageBalance?: number,
    public creditMutationMargin?: number,
    public bufferFs?: number,
    public bufferAvverage?: number,
    public bufferCredit?: number,
    public bufferIncomeFs?: number,
    public bufferIncomeAverage?: number,
    public bufferIncomeCredit?: number
  ) {
    this.existingFs = 0;
    this.existingCreditMutation = 0;
    this.currentProposalFs = 0;
    this.currentProposalCredit = 0;
  }
}

export class RepaymentCapability implements IRepaymentCapability {
  constructor(public id?: string, public detail?: IRepaymentCapabilityDetail) {
    this.detail = new RepaymentCapabilityDetail();
  }
}
