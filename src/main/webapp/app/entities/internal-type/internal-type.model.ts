export interface IInternalType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class InternalType implements IInternalType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}
