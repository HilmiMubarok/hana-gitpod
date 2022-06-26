export interface IFinAccountTrans {
  id?: number;
  description?: string;
  sequence?: number;
  openBalance?: number;
  debit?: number;
  credit?: number;
  endBalance?: number;
  entryDate?: Date;
  postedDate?: Date;
  accountAccountNumber?: string;
  accountId?: number;
  transactionTypeDescription?: string;
  transactionTypeId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  roles?: any;
  attributes?: any;
}

export class FinAccountTrans implements IFinAccountTrans {
  constructor(
    public id?: number,
    public description?: string,
    public sequence?: number,
    public openBalance?: number,
    public debit?: number,
    public credit?: number,
    public endBalance?: number,
    public entryDate?: Date,
    public postedDate?: Date,
    public accountAccountNumber?: string,
    public accountId?: number,
    public transactionTypeDescription?: string,
    public transactionTypeId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public roles?: any,
    public attributes?: any
  ) {}
}
