export interface IAccountTransCategory {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class AccountTransCategory implements IAccountTransCategory {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}
