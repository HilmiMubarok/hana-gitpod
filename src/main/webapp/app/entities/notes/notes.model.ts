export interface INotes {
  id?: number;
  message?: string;
  userId?: string;
  positionUserId?: string;
  createDate?: Date;
  recomendation?: string;
  condition?: string;
  type?: string;
  applicationId?: number;
  positionId?: number;
  positionTypeDescription?: string;
  employeeFirstName?: string;
  employeeLastName?: string;
  fromDate?: Date;
  thruDate?: Date;
  path?: string;
  received?: boolean;
  uuid?: string;
  attributes?: any
}

export class Notes implements INotes {
  constructor(
    public id?: number,
    public message?: string,
    public userId?: string,
    public positionUserId?: string,
    public createDate?: Date,
    public recomendation?: string,
    public condition?: string,
    public applicationId?: number,
    public positionId?: number,
    public positionTypeDescription?: string,
    public employeeFirstName?: string,
    public employeeLastName?: string,
    public type?: string,
      public fromDate?: Date,
    public thruDate?: Date,
      public path?: string,
    public received?: boolean,
    public uuid?: string,
      public attributes?: any
  ) {}
}
