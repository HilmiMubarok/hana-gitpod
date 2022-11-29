export interface IMasterParameter {
  id?: number;
  status?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
}

export class MasterParameter implements IMasterParameter {
  constructor(
    public id?: number,
    public status?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date
  ) {}
}
