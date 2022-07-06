export interface IEmployment {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  relationTypeDescription?: string;
  relationTypeId?: string;
  partyToName?: string;
  partyToId?: string;
  partyFromName?: string;
  partyFromId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
}

export class Employment implements IEmployment {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public relationTypeDescription?: string,
    public relationTypeId?: string,
    public partyToName?: string,
    public partyToId?: string,
    public partyFromName?: string,
    public partyFromId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string
  ) {}
}
