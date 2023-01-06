export interface IAppraisalRole {
  id?: number;
  fromDate?: Date;
  thruDate?: Date;
  roleId?: string;
  roleDescription?: string;
  fromPartyId?: string;
  fromPartyName?: string;
  relationTypeId?: string;
  relationTypeDescription?: string;
  partyId?: string;
  partyName?: string;
  appraisalId?: Number;
  attributes?: any;
}

export class AppraisalRole implements IAppraisalRole {
  constructor(
    public id?: number,
    public fromDate?: Date,
    public thruDate?: Date,
    public roleId?: string,
    public roleDescription?: string,
    public fromPartyId?: string,
    public fromPartyName?: string,
    public relationTypeId?: string,
    public relationTypeDescription?: string,
    public partyId?: string,
    public partyName?: string,
    public appraisalId?: Number,
    public attributes?: any
  ) {}
}
