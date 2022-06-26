import { IPaymentApplication } from 'app/entities/payment-application/payment-application.model';

export interface IPayment {
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
  applications?: IPaymentApplication[];
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  roles?: any;
  attributes?: any;
}

export class Payment implements IPayment {
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
    public applications?: IPaymentApplication[],
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public roles?: any,
    public attributes?: any
  ) {
    this.posted = this.posted || false;
  }
}
