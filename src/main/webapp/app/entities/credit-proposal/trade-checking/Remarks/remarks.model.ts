export interface IRemarks {
  remarks?: string;
}

export class CheckRemarks implements IRemarks {
  constructor(public remarks?: string) {
    this.remarks = '';
  }
}
