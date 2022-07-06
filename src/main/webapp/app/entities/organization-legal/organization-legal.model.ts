export interface IOrganizationLegal {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  organizationName?: string;
  organizationId?: string;
}

export class OrganizationLegal implements IOrganizationLegal {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public organizationName?: string,
    public organizationId?: string
  ) {}
}
