export interface IMasterFinancialInstitution {
  id?: number;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  description?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: Date;
  lastModifiedDate?: Date;
  code?: string;
  name?: string;
}

export class MasterFinancialInstitution implements IMasterFinancialInstitution {
  constructor(
    public id?: number,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public description?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: Date,
    public lastModifiedDate?: Date,
    public code?: string,
    public name?: string
  ) {}
}
