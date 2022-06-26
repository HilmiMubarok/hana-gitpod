export interface IPartyPaymentPref {
  id?: number;
  description?: string;
  accountNumber?: string;
  defaultPayment?: boolean;
  partyName?: string;
  partyId?: string;
  paymentMethodTypeDescription?: string;
  paymentMethodTypeId?: string;
  providerName?: string;
  providerId?: string;
}

export class PartyPaymentPref implements IPartyPaymentPref {
  constructor(
    public id?: number,
    public description?: string,
    public accountNumber?: string,
    public defaultPayment?: boolean,
    public partyName?: string,
    public partyId?: string,
    public paymentMethodTypeDescription?: string,
    public paymentMethodTypeId?: string,
    public providerName?: string,
    public providerId?: string
  ) {
    this.defaultPayment = this.defaultPayment || false;
  }
}
