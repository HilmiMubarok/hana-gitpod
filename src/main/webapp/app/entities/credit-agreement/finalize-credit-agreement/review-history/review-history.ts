export interface IReviewHistory {
  approverName: string;
  position: string;
  date: string;
  path?: string;
}

export class ReviewHistory implements IReviewHistory {
  constructor(public approverName: string, public position: string, public date: string, public path?: string) {
    this.approverName = '';
    this.position = '';
    this.date = '';
    this.path = '';
  }
}
