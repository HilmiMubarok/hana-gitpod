export interface IGuarantour {
  remarks?: string;
}

export class Guarantour implements IGuarantour {
  constructor(public remarks?: string) {
    this.remarks = '';
  }
}
