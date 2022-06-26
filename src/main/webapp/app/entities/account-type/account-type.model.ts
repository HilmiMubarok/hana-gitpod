export interface IAccountType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class AccountType implements IAccountType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}
