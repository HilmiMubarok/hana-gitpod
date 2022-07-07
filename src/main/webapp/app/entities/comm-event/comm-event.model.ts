export interface ICommEvent {
  id?: number;
  notes?: string;
  startDate?: Date;
  endDate?: Date;
  commEventTypeDescription?: string;
  commEventTypeId?: string;
  purposeTypeDescription?: string;
  purposeTypeId?: string;
  statusItemDescription?: string;
  statusItemId?: string;
  partyId?: string;
  contactMechId?: number;
  roles?: any;
  attributes?: any;
}

export class CommEvent implements ICommEvent {
  constructor(
    public id?: number,
    public notes?: string,
    public startDate?: Date,
    public endDate?: Date,
    public commEventTypeDescription?: string,
    public commEventTypeId?: string,
    public purposeTypeDescription?: string,
    public purposeTypeId?: string,
    public statusItemDescription?: string,
    public statusItemId?: string,
    public partyId?: string,
    public contactMechId?: number,
    public roles?: any,
    public attributes?: any
  ) {}
}
