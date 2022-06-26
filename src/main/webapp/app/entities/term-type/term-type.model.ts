export interface ITermType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
  attributes?: any;
}

export class TermType implements ITermType {
  constructor(
    public id?: string,
    public description?: string,
    public parentDescription?: string,
    public parentId?: string,
    public attributes?: any
  ) {}
}
