
export interface INotes {
  indexNum?: number;
  userId?: string;
  message?: string;
  createDate?: Date;
  attributes?: any;
}

export class Notes implements INotes {
  constructor(
    public indexNum?: number,
    public userId?: string,
    public message?: string,
    public createDate?: Date,
    public attributes?: any
  ) {}
}
