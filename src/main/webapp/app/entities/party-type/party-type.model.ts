export interface IPartyType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class PartyType implements IPartyType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}
