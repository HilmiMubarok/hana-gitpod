export interface IAccountTransType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
  transCategoryId?: string;
}

export class AccountTransType implements IAccountTransType {
  constructor(
    public id?: string,
    public description?: string,
    public parentDescription?: string,
    public parentId?: string,
    public transCategoryId?: string
  ) {}
}
