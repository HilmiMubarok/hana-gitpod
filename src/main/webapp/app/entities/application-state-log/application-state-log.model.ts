export interface IApplicationStateLog {
  id?: number;
  businessKey?: string;
  status?: string;
  userName?: string;
  note?: string;
  createdBy?: string;
  createdDate?: Date;
}

export class ApplicationStateLog implements IApplicationStateLog {
  constructor(
    public id?: number,
    public businessKey?: string,
    public status?: string,
    public userName?: string,
    public note?: string,
    public createdBy?: string,
    public createdDate?: Date
  ) {}
}
