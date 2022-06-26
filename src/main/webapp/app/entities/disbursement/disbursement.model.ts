export interface IDisbursement {
  id?: number;
  paymentNumber?: string;
  refferenceNumber?: string;
  description?: string;
  amount?: number;
  posted?: boolean;
  transactionDate?: Date;
  postedDate?: Date;
  paymentTypeDescription?: string;
  paymentTypeId?: string;
  paymentMethodDescription?: string;
  paymentMethodId?: number;
  accountTransId?: number;
  acctgTransId?: number;
  paidFromName?: string;
  paidFromId?: string;
  paidToName?: string;
  paidToId?: string;
  internalName?: string;
  internalId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  roles?: any;
  attributes?: any;
}

export class Disbursement implements IDisbursement {
  constructor(
    public id?: number,
    public paymentNumber?: string,
    public refferenceNumber?: string,
    public description?: string,
    public amount?: number,
    public posted?: boolean,
    public transactionDate?: Date,
    public postedDate?: Date,
    public paymentTypeDescription?: string,
    public paymentTypeId?: string,
    public paymentMethodDescription?: string,
    public paymentMethodId?: number,
    public accountTransId?: number,
    public acctgTransId?: number,
    public paidFromName?: string,
    public paidFromId?: string,
    public paidToName?: string,
    public paidToId?: string,
    public internalName?: string,
    public internalId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public roles?: any,
    public attributes?: any
  ) {
    this.posted = this.posted || false;
  }
}
