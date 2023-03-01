export interface ILendingProgramParameter {
  id?: number;
  code?: string;
  description?: string;
  statusCode?: string;
  statusId?: string;
  statusCode?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
}

export class LendingProgramParameter implements ILendingProgramParameter {
  constructor(
    public id?: number,
    public code?: string,
    public description?: string,
    public statusCode?: string,
    public statusId?: string,
    public statusCode?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date
  ) {}
}
