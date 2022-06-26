export interface IUom {
  id?: string;
  description?: string;
  abbreviation?: string;
  uomTypeDescription?: string;
  uomTypeId?: string;
}

export class Uom implements IUom {
  constructor(
    public id?: string,
    public description?: string,
    public abbreviation?: string,
    public uomTypeDescription?: string,
    public uomTypeId?: string
  ) {}
}
