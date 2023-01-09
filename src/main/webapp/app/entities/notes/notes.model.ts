export interface INotes {
  id?: number;
  message?: string;
  userId?: string;
  positionUserId?: string;
  createDate?: Date;
  recomendation?: string;
  condition?: string;
  type?: string;
  attributes?: any;
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
	public type?: string,
    public attributes?: any
  ) {}
}
