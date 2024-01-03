export interface IApplicationStateLog {
  id?: number;
  businessKey?: string;
  status?: string;
  statusDescription?: string;
  userName?: string;
  note?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedDate?: Date;
}

export class ApplicationStateLog implements IApplicationStateLog {
  constructor(
    public id?: number,
    public businessKey?: string,
    public status?: string,
    public statusDescription?: string,
    public userName?: string,
    public note?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedDate?: Date
  ) {}
}
