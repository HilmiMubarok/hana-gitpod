export interface IApplicationRole {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  roleId: string;
  roleDescription: string;
  partyId?: string;
  partyName?: string;
  applicationId?: string;
}
