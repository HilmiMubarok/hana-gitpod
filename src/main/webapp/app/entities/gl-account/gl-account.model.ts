export interface IGLAccount {
  id?: string;
  accountNumber?: string;
  name?: string;
  description?: string;
  accountTypeDescription?: string;
  accountTypeId?: string;
  accountClassDescription?: string;
  accountClassId?: string;
  resourceTypeDescription?: string;
  resourceTypeId?: string;
  parentId?: string;
}

export class GLAccount implements IGLAccount {
  constructor(
    public id?: string,
    public accountNumber?: string,
    public name?: string,
    public description?: string,
    public accountTypeDescription?: string,
    public accountTypeId?: string,
    public accountClassDescription?: string,
    public accountClassId?: string,
    public resourceTypeDescription?: string,
    public resourceTypeId?: string,
    public parentId?: string
  ) {}
}
