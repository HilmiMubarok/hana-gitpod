export interface IPaymentMethod {
  id?: number;
  code?: string;
  accountNumber?: string;
  description?: string;
  notes?: any;
  fromDate?: Date;
  thruDate?: Date;
  paymentMethodTypeDescription?: string;
  paymentMethodTypeId?: string;
  glAccountDescription?: string;
  glAccountId?: string;
  finAccountId?: number;
  internalName?: string;
  internalId?: string;
  providerName?: string;
  providerId?: string;
}

export class PaymentMethod implements IPaymentMethod {
  constructor(
    public id?: number,
    public code?: string,
    public accountNumber?: string,
    public description?: string,
    public notes?: any,
    public fromDate?: Date,
    public thruDate?: Date,
    public paymentMethodTypeDescription?: string,
    public paymentMethodTypeId?: string,
    public glAccountDescription?: string,
    public glAccountId?: string,
    public finAccountId?: number,
    public internalName?: string,
    public internalId?: string,
    public providerName?: string,
    public providerId?: string
  ) {}
}
