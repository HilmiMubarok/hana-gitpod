import { IBillingTerm } from 'app/entities/billing-term/billing-term.model';
import { IBillingItem } from 'app/entities/billing-item/billing-item.model';

export interface IBilling {
  id?: number;
  billingNumber?: string;
  description?: string;
  vendorInvoice?: string;
  taxInvoice?: string;
  posted?: boolean;
  dueDate?: Date;
  postedDate?: Date;
  billingTypeDescription?: string;
  billingTypeId?: string;
  acctgTransId?: number;
  settlementId?: number;
  terms?: IBillingTerm[];
  items?: IBillingItem[];
  billFromName?: string;
  billFromId?: string;
  billToName?: string;
  billToId?: string;
  internalName?: string;
  internalId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  roles?: any;
  attributes?: any;
}

export class Billing implements IBilling {
  constructor(
    public id?: number,
    public billingNumber?: string,
    public description?: string,
    public vendorInvoice?: string,
    public taxInvoice?: string,
    public posted?: boolean,
    public dueDate?: Date,
    public postedDate?: Date,
    public billingTypeDescription?: string,
    public billingTypeId?: string,
    public acctgTransId?: number,
    public settlementId?: number,
    public terms?: IBillingTerm[],
    public items?: IBillingItem[],
    public billFromName?: string,
    public billFromId?: string,
    public billToName?: string,
    public billToId?: string,
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
