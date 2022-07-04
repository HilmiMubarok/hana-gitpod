import dayjs from 'dayjs/esm';

export interface IEmployment {
  id?: number;
  fromDate?: dayjs.Dayjs | null;
  thruDate?: dayjs.Dayjs | null;
  relationTypeId?: string | null;
  relationTypeDescription?: string | null;
  partyToId?: string | null;
  partyToName?: string | null;
  partyFromId?: string | null;
  partyFromName?: string | null;
}

export class Employment implements IEmployment {
  constructor(
    public id?: number,
    public fromDate?: dayjs.Dayjs | null,
    public thruDate?: dayjs.Dayjs | null,
    public relationTypeId?: string | null,
    public relationTypeDescription?: string | null,
    public partyToId?: string | null,
    public partyToName?: string | null,
    public partyFromId?: string | null,
    public partyFromName?: string | null
  ) {}
}

export function getEmploymentIdentifier(employment: IEmployment): number | undefined {
  return employment.id;
}
