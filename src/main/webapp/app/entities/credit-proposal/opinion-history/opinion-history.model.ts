export interface IOpinionHistory {
  id?: number;
  reviewerName?: string;
  position?: string;
  date?: Date;
  opini?: string;
  remarks?: string;
  recommendation?: string;
  condition?: string;
  remarks1?: string;
}

export class OpinionHistory implements IOpinionHistory {
  constructor(
    public id?: number,
    public reviewerName?: string,
    public position?: string,
    public date?: Date,
    public opini?: string,
    public remarks?: string,
    public recommendation?: string,
    public condition?: string,
    public remarks1?: string
  ) {
    this.id = 0;
    this.reviewerName = '';
    this.position = '';
    this.date = new Date();
    this.opini = '';
    this.remarks = '';
    this.recommendation = '';
    this.condition = '';
    this.remarks1 = '';
  }
}
