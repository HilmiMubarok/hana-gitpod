export interface INotes {
  id?: number;
  message?: string;
  applicationId?: number,
  userId?: string;
  positionUserId?: string;
  createDate?: Date;
  recomendation?: string;
  condition?: string;
  type?: string;
  attributes?: any;
  received?: boolean;
}

export class Notes implements INotes {
  constructor(
    public id?: number,
    public message?: string,
    public userId?: string,
    public applicationId?: number,
    public positionUserId?: string,
    public createDate?: Date,
    public recomendation?: string,
    public condition?: string,
	public type?: string,
    public attributes?: any,
    public received?: boolean,
  ) {}
}
