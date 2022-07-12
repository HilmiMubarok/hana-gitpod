export interface IEmploymentType {
  id?: string;
  description?: string;
  permanent?: boolean;
  parentId?: string;
  parentDescription?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
}

export class EmploymentType implements IEmploymentType {
  constructor(
    public id?: string,
    public description?: string,
    public permanent?: boolean,
    public parentId?: string,
    public parentDescription?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string
  ) {
    this.permanent = this.permanent || false;
  }
}
