export interface IRelationType {
  id?: string;
  idRelationType?: number;
  description?: string;
  parentDescription?: string;
  parentId?: number;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
}

export class RelationType implements IRelationType {
  constructor(
    public id?: string,
    public idRelationType?: number,
    public description?: string,
    public parentDescription?: string,
    public parentId?: number,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string
  ) {}
}
