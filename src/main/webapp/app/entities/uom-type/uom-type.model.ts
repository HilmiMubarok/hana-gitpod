export interface IUomType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class UomType implements IUomType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}
