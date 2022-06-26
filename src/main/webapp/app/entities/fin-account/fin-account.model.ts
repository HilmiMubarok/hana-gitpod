import { IAccountBalanced } from 'app/entities/account-balanced/account-balanced.model';
import { IFinAccountTrans } from 'app/entities/fin-account-trans/fin-account-trans.model';

export interface IFinAccount {
  id?: number;
  accountNumber?: string;
  description?: string;
  sequence?: number;
  repLevel?: number;
  actBalance?: number;
  avlBalance?: number;
  accountTypeDescription?: string;
  accountTypeId?: string;
  ownerName?: string;
  ownerId?: string;
  balances?: IAccountBalanced[];
  items?: IFinAccountTrans[];
  glAccountId?: number;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  roles?: any;
  attributes?: any;
}

export class FinAccount implements IFinAccount {
  constructor(
    public id?: number,
    public accountNumber?: string,
    public description?: string,
    public sequence?: number,
    public repLevel?: number,
    public actBalance?: number,
    public avlBalance?: number,
    public accountTypeDescription?: string,
    public accountTypeId?: string,
    public ownerName?: string,
    public ownerId?: string,
    public balances?: IAccountBalanced[],
    public items?: IFinAccountTrans[],
    public glAccountId?: number,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public roles?: any,
    public attributes?: any
  ) {}
}
