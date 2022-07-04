import dayjs from 'dayjs/esm';

export interface IOrganizationFinancial {
  id?: number;
  fromDate?: dayjs.Dayjs | null;
  thruDate?: dayjs.Dayjs | null;
  organizationId?: string | null;
  organizationName?: string | null;
}

export class OrganizationFinancial implements IOrganizationFinancial {
  constructor(
    public id?: number,
    public fromDate?: dayjs.Dayjs | null,
    public thruDate?: dayjs.Dayjs | null,
    public organizationId?: string | null,
    public organizationName?: string | null
  ) {}
}

export function getOrganizationFinancialIdentifier(organizationFinancial: IOrganizationFinancial): number | undefined {
  return organizationFinancial.id;
}
