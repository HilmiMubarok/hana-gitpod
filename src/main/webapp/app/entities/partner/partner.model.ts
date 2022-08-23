export interface IPartner {
  id?: number;
  partnerId?: string;
  partyId?: string;
  roleId?: string;
  customer?: boolean;
  vendor?: boolean;
  paymentProvider?: boolean;
  fromDate?: Date;
  thruDate?: Date;
  organizationId?: string;
  statusDescription?: string;
  statusId?: string;
  attributes?: any;
}

export class Partner implements IPartner {
  constructor(
    public id?: number,
    public partnerId?: string,
    public partyId?: string,
    public roleId?: string,
    public customer?: boolean,
    public vendor?: boolean,
    public paymentProvider?: boolean,
    public fromDate?: Date,
    public thruDate?: Date,
    public organizationId?: string,
    public statusDescription?: string,
    public statusId?: string,
    public attributes?: any
  ) {
    this.customer = this.customer || false;
    this.vendor = this.vendor || false;
    this.paymentProvider = this.paymentProvider || false;
  }
}
