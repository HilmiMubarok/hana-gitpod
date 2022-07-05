export interface IPartyGroup {
  id?: number;
  groupName?: string | null;
  prefix?: string | null;
  officePhone?: string | null;
  otherPhone?: string | null;
  officeMail?: string | null;
  faxOffice?: string | null;
  taxIdNumber?: string | null;
}

export class PartyGroup implements IPartyGroup {
  constructor(
    public id?: number,
    public groupName?: string | null,
    public prefix?: string | null,
    public officePhone?: string | null,
    public otherPhone?: string | null,
    public officeMail?: string | null,
    public faxOffice?: string | null,
    public taxIdNumber?: string | null
  ) {}
}

export function getPartyGroupIdentifier(partyGroup: IPartyGroup): number | undefined {
  return partyGroup.id;
}
