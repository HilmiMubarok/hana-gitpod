export interface IReviewHistory {
  approverName: string;
  position: string;
  date: string;
}

export class ReviewHistory implements IReviewHistory {
  constructor(public approverName: string, public position: string, public date: string) {
    this.approverName = '';
    this.position = '';
    this.date = '';
  }
}
