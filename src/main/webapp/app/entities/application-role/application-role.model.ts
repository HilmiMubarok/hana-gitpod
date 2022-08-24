export interface IApplicationRole {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  roleId?: string;
  roleDescription?: string;
  partyId?: string;
  partyName?: string;
  applicationId?: string;
}

export class ApplicationRole implements IApplicationRole {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public roleId?: string,
    public roleDescription?: string,
    public partyId?: string,
    public partyName?: string,
    public applicationId?: string
  ) {}
}
