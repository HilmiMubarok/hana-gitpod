export interface IOpinionHistory {
  reviewerName?: string;
  position?: string;
  date?: Date;
  opini?: string;
  remarks?: string;
}

export class OpinionHistory implements IOpinionHistory {
  constructor(public reviewerName?: string, public position?: string, public date?: Date, public opini?: string, public remarks?: string) {
    this.reviewerName = '';
    this.position = '';
    this.date = new Date();
    this.opini = '';
    this.remarks = '';
  }
}
