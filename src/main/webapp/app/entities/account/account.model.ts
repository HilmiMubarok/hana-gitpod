export interface IAccount {
  id?: number;
  accountNumber?: string;
  description?: string;
  sequence?: number;
  accountTypeDescription?: string;
  accountTypeId?: string;
  internalName?: string;
  internalId?: string;
  ownerName?: string;
  ownerId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  attributes?: any;
}

export class Account implements IAccount {
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
    public attributes?: any
  ) {}
}
