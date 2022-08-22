import { IAccountProduct } from '../account-product/account-product.model';
import { IAccountTrans } from '../account-trans/account-trans.model';
import { IAccount } from '../account/account.model';

export interface IFinServiceAccount extends IAccount {
  shortId?: string;
  accountProducts?: IAccountProduct[];
  accountTrans?: IAccountTrans[];
}

export class FinServiceAccount implements IFinServiceAccount {
  constructor(
    public id?: number,
    public accountNumber?: string,
    public description?: string,
    public sequence?: number,
    public accountTypeDescription?: string,
    public accountTypeId?: string,
    public internalName?: string,
    public internalId?: string,
    public ownerName?: string,
    public ownerId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public attributes?: any,
    public accountProducts?: IAccountProduct[],
    public accountTrans?: IAccountTrans[]
  ) {
    this.accountProducts = [];
    this.accountTrans = [];
  }
}
