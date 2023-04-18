export interface ILendingProgramParameter {
  id?: number;
  code?: string;
  description?: string;
  statusCode?: string;
  statusId?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  lendingProgram?: string;
  status?: string;
}

export class LendingProgramParameter implements ILendingProgramParameter {
  constructor(
    public id?: number,
    public code?: string,
    public description?: string,
    public statusCode?: string,
    public statusId?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
    public lendingProgram?: string,
    public status?: string
  ) {}
}
