export interface IAcctgTransItem {
  id?: number;
  debitCreditFlag?: string;
  amount?: number;
  transId?: number;
  internalName?: string;
  internalId?: number;
  accountName?: string;
  accountId?: number;
  periodId?: number;
}

export class AcctgTransItem implements IAcctgTransItem {
  constructor(
    public id?: number,
    public debitCreditFlag?: string,
    public amount?: number,
    public transId?: number,
    public internalName?: string,
    public internalId?: number,
    public accountName?: string,
    public accountId?: number,
    public periodId?: number
  ) {}
}
