export interface IAccountBalanced {
  id?: number;
  description?: string;
  amount?: number;
  balanced?: number;
  accountAccountNumber?: string;
  accountId?: number;
  transCategoryId?: string;
}

export class AccountBalanced implements IAccountBalanced {
  constructor(
    public id?: number,
    public description?: string,
    public amount?: number,
    public balanced?: number,
    public accountAccountNumber?: string,
    public accountId?: number,
    public transCategoryId?: string
  ) {}
}
