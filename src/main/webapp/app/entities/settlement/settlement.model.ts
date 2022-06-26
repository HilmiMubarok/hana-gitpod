import { IDisbursement } from 'app/entities/disbursement/disbursement.model';

export interface ISettlement {
  id?: number;
  settlementNumber?: string;
  dateDue?: Date;
  datePaid?: Date;
  settlementTypeDescription?: string;
  settlementTypeId?: string;
  paymentMethodDescription?: string;
  paymentMethodId?: string;
  internalName?: string;
  internalId?: string;
  items?: IDisbursement[];
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  roles?: any;
  attributes?: any;
}

export class Settlement implements ISettlement {
  constructor(
    public id?: number,
    public settlementNumber?: string,
    public dateDue?: Date,
    public datePaid?: Date,
    public settlementTypeDescription?: string,
    public settlementTypeId?: string,
    public paymentMethodDescription?: string,
    public paymentMethodId?: string,
    public internalName?: string,
    public internalId?: string,
    public items?: IDisbursement[],
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public roles?: any,
    public attributes?: any
  ) {}
}
