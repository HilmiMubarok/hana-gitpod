export interface IPurposeType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class PurposeType implements IPurposeType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}
