export interface ISurveyor {
  id?: number;
  surveyorCode?: string;
  fromDate?: Date;
  thruDate?: Date;
  roleDescription?: string;
  roleId?: string;
  personName?: string;
  personId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  visitBy?: string;
}

export class Surveyor implements ISurveyor {
  constructor(
    public id?: number,
    public surveyorCode?: string,
    public fromDate?: Date,
    public thruDate?: Date,
    public roleDescription?: string,
    public roleId?: string,
    public personName?: string,
    public personId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public visitBy?: string
  ) {}
}
