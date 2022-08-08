export interface IEmploymentType {
  id?: string;
  description?: string;
  permanent?: boolean;
  parentDescription?: string;
  parentId?: string;
}

export class EmploymentType implements IEmploymentType {
  constructor(
    public id?: string,
    public description?: string,
    public permanent?: boolean,
    public parentDescription?: string,
    public parentId?: string
  ) {
    this.permanent = this.permanent || false;
  }
}
