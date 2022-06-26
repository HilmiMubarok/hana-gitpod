export interface IBillingItemType {
  id?: string;
  code?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
  glAccountDescription?: string;
  glAccountId?: string;
  attributes?: any;
}

export class BillingItemType implements IBillingItemType {
  constructor(
    public id?: string,
    public code?: string,
    public description?: string,
    public parentDescription?: string,
    public parentId?: string,
    public glAccountDescription?: string,
    public glAccountId?: string,
    public attributes?: any
  ) {}
}
