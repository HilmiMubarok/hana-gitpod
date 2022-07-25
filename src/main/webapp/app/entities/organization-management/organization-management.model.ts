export interface IOrganizationManagement {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  organizationName?: string;
  organizationId?: string;
}

export class OrganizationManagement implements IOrganizationManagement {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public organizationName?: string,
    public organizationId?: string
  ) {}
}
