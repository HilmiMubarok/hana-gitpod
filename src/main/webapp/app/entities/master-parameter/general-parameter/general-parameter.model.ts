export interface IGeneralParameter {
  id?: number;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: Date;
  lastModifiedDate?: Date;
  parameterTypeId?: string;
  parameterTypeDescription?: string;
  code?: string;
  value?: string;
}

export class GeneralParameter implements IGeneralParameter {
  constructor(
    public id?: number,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: Date,
    public lastModifiedDate?: Date,
    public parameterTypeId?: string,
    public parameterTypeDescription?: string,
    public code?: string,
    public value?: string
  ) {}
}
