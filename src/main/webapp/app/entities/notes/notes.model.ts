export interface INotes {
  id?: number;
  applicationId?: number;
  positionId?: number;
  positionTypeDescription?: string;
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
  attributes?: any;
}

export class Notes implements INotes {
  constructor(
    public id?: number,
	public applicationId?: number,
	public positionId?: number,
	public positionTypeDescription?: string,
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
    public attributes?: any
  ) {}
}
