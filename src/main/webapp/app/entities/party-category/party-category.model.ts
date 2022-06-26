export interface IPartyCategory {
  id?: string;
  description?: string;
  categoryTypeDescription?: string;
  categoryTypeId?: string;
  parentDescription?: string;
  parentId?: string;
}

export class PartyCategory implements IPartyCategory {
  constructor(
    public id?: string,
    public description?: string,
    public categoryTypeDescription?: string,
    public categoryTypeId?: string,
    public parentDescription?: string,
    public parentId?: string
  ) {}
}
