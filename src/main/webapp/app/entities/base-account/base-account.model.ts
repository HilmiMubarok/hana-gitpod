import { IAccountBalanced } from 'app/entities/account-balanced/account-balanced.model';

export interface IBaseAccount {
  id?: number;
  accountNumber?: string;
  description?: string;
  sequence?: number;
  accountTypeDescription?: string;
  accountTypeId?: string;
  ownerName?: string;
  ownerId?: string;
  balances?: IAccountBalanced[];
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  roles?: any;
  attributes?: any;
}

export class BaseAccount implements IBaseAccount {
  constructor(
    public id?: number,
    public accountNumber?: string,
    public description?: string,
    public sequence?: number,
    public accountTypeDescription?: string,
    public accountTypeId?: string,
    public ownerName?: string,
    public ownerId?: string,
    public balances?: IAccountBalanced[],
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public roles?: any,
    public attributes?: any
  ) {}
}
