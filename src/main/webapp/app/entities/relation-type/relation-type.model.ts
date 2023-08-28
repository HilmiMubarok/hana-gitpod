export interface IRelationType {
  id?: string;
  idRelationType?: number;
  description?: string;
  parentDescription?: string;
  parentId?: string;
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
    public parentId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string
  ) {}
}
