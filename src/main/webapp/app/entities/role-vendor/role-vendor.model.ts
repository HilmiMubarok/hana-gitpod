export interface IRoleVendor {
  id?: number;
  vendorId?: string;
  fromDate?: Date;
  thruDate?: Date;
  roleDescription?: string;
  roleId?: string;
  partyName?: string;
  partyId?: string;
}

export class RoleVendor implements IRoleVendor {
  constructor(
    public id?: number,
    public vendorId?: string,
    public fromDate?: Date,
    public thruDate?: Date,
    public roleDescription?: string,
    public roleId?: string,
    public partyName?: string,
    public partyId?: string
  ) {}
}
