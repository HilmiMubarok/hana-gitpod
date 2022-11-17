export interface IRejectReason {
  reject?: string;
}

export class RejectReason implements IRejectReason {
  constructor(public reject?: string) {
    this.reject = '';
  }
}
