export interface INotes {
  id?: number;
  applicationId?: number;
  positionId?: number;
  positionTypeDescription?: string;
  partyId?: string;
  positionTypeId?: string;
  employeeFirstName?: string;
  employeeLastName?: string;
  createDate?: string;
  message?: string;
  recomendation?: string;
  type?: string;
  fromDate?: Date;
  thruDate?: Date;
  path?: string;
  received?: boolean;
  uuid?: string;
  modifiedDate?: Date;
  updateAction?: boolean;
  attributes?: any;
  statusId?: string;
  mailStatus?: string;
}

export class Notes implements INotes {
  constructor(
    public id?: number,
    public applicationId?: number,
    public positionId?: number,
    public positionTypeDescription?: string,
    public partyId?: string,
    public positionTypeId?: string,
    public employeeFirstName?: string,
    public employeeLastName?: string,
    public createDate?: string,
    public message?: string,
    public recomendation?: string,
    public type?: string,
    public fromDate?: Date,
    public thruDate?: Date,
    public path?: string,
    public received?: boolean,
    public uuid?: string,
    public modifiedDate?: Date,
    public updateAction?: boolean,
    public attributes?: any,
    public statusId?: string,
    public mailStatus?: string
  ) {}
}
