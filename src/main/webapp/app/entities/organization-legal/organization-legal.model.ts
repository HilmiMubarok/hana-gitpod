import dayjs from 'dayjs/esm';

export interface IOrganizationLegal {
  id?: number;
  fromDate?: dayjs.Dayjs | null;
  thruDate?: dayjs.Dayjs | null;
  organizationId?: string | null;
  organizationName?: string | null;
}

export class OrganizationLegal implements IOrganizationLegal {
  constructor(
    public id?: number,
    public fromDate?: dayjs.Dayjs | null,
    public thruDate?: dayjs.Dayjs | null,
    public organizationId?: string | null,
    public organizationName?: string | null
  ) {}
}

export function getOrganizationLegalIdentifier(organizationLegal: IOrganizationLegal): number | undefined {
  return organizationLegal.id;
}
