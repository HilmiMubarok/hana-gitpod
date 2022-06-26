import { IAcctgTransItem } from 'app/entities/acctg-trans-item/acctg-trans-item.model';

export interface IAcctgTrans {
  id?: number;
  description?: string;
  transactionDate?: Date;
  entryDate?: Date;
  transTypeDescription?: string;
  transTypeId?: string;
  internalName?: string;
  internalId?: number;
  items?: IAcctgTransItem[];
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
}

export class AcctgTrans implements IAcctgTrans {
  constructor(
    public id?: number,
    public description?: string,
    public transactionDate?: Date,
    public entryDate?: Date,
    public transTypeDescription?: string,
    public transTypeId?: string,
    public internalName?: string,
    public internalId?: number,
    public items?: IAcctgTransItem[],
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string
  ) {}
}
