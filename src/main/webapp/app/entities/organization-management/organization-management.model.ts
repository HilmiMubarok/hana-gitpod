export interface IOrganizationManagement {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  organizationId?: string;
  organizationName?: string;
}

export class OrganizationManagement implements IOrganizationManagement {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public organizationId?: string,
    public organizationName?: string
  ) {}
}
