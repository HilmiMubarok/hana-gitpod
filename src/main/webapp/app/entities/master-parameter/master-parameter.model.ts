export interface IMasterParameter {
  id?: number;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
}

export class MasterParameter implements IMasterParameter {
  constructor(
    public id?: number,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date
  ) {}
}
