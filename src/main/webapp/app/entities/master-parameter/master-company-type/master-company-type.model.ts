export interface IMasterCompanyType {
  id?: number;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  abbreviation?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: Date;
  lastModifiedDate?: Date;
  code?: string;
  name?: string;
}

export class MasterCompanyType implements IMasterCompanyType {
  constructor(
    public id?: number,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public abbreviation?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: Date,
    public lastModifiedDate?: Date,
    public code?: string,
    public name?: string
  ) {}
}
