import dayjs from 'dayjs/esm';

export interface IOrganizationManagement {
  id?: number;
  fromDate?: dayjs.Dayjs | null;
  thruDate?: dayjs.Dayjs | null;
  organizationId?: string | null;
  organizationName?: string | null;
}

export class OrganizationManagement implements IOrganizationManagement {
  constructor(
    public id?: number,
    public fromDate?: dayjs.Dayjs | null,
    public thruDate?: dayjs.Dayjs | null,
    public organizationId?: string | null,
    public organizationName?: string | null
  ) {}
}

export function getOrganizationManagementIdentifier(organizationManagement: IOrganizationManagement): number | undefined {
  return organizationManagement.id;
}
