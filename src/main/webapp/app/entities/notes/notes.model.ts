export interface INotes {
  id?: number;
  message?: string;
  userId?: string;
  positionUserId?: string;
  createDate?: Date;
  recomendation?: string;
  condition?: string;
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
    public attributes?: any
  ) {}
}
