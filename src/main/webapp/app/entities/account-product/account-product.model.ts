export interface IAccountProduct {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  accountId?: string;
  productId?: number;
  productName?: string;
}

export class AccountProduct implements IAccountProduct {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public accountId?: string,
    public productId?: number,
    public productName?: string
  ) {}
}
