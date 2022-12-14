export interface INotes {
  id?: number;
  message?: string;
  userId?: string;
  approvedName?: string;
  position?: string;
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
    public approvedName?: string,
    public position?: string,
    public createDate?: Date,
    public recomendation?: string,
    public condition?: string,
    public attributes?: any
  ) {}
}
