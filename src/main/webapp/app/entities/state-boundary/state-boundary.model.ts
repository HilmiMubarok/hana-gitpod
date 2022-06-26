export interface IStateBoundary {
  id?: number;
  code?: string;
  description?: string;
  abbreviation?: string;
  postalCode?: string;
  dagriCode?: string;
  dagriName?: string;
  boundaryTypeDescription?: string;
  boundaryTypeId?: string;
  parentId?: number;
}

export class StateBoundary implements IStateBoundary {
  constructor(
    public id?: number,
    public code?: string,
    public description?: string,
    public abbreviation?: string,
    public postalCode?: string,
    public dagriCode?: string,
    public dagriName?: string,
    public boundaryTypeDescription?: string,
    public boundaryTypeId?: string,
    public parentId?: number
  ) {}
}
