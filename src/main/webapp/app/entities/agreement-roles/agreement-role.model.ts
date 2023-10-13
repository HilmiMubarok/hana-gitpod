export interface IAgreementRole {
  id?: number | null;
  fromDate?: Date | null;
  thruDate?: Date | null;
  roleId?: string | null;
  roleDescription?: string | null;
  partyId?: string | null;
  partyName?: string | null;
  agreementId?: string | null;
  relationTypeId?: string | null;
  relationTypeDescription?: string | null;
}

export class AgreementRole implements IAgreementRole {
  constructor(
    public id?: number | null,
    public fromDate?: Date,
    public thruDate?: Date | null,
    public roleId?: string | null,
    public roleDescription?: string | null,
    public partyId?: string | null,
    public partyName?: string | null,
    public agreementId?: string | null,
    public relationTypeId?: string | null,
    public relationTypeDescription?: string | null
  ) {}
}
