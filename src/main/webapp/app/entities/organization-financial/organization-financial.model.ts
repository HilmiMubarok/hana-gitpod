export interface IOrganizationFinancial {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  organizationName?: string;
  organizationId?: string;
}

export class OrganizationFinancial implements IOrganizationFinancial {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public organizationName?: string,
    public organizationId?: string
  ) {}
}
