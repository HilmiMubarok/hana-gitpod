export interface IRoleInternal {
  id?: number;
  internalId?: string;
  costCenter?: boolean;
  fromDate?: Date;
  thruDate?: Date;
  roleDescription?: string;
  roleId?: string;
  partyName?: string;
  partyId?: string;
}

export class RoleInternal implements IRoleInternal {
  constructor(
    public id?: number,
    public internalId?: string,
    public costCenter?: boolean,
    public fromDate?: Date,
    public thruDate?: Date,
    public roleDescription?: string,
    public roleId?: string,
    public partyName?: string,
    public partyId?: string
  ) {
    this.costCenter = this.costCenter || false;
  }
}
