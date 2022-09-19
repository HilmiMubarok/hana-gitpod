export interface IFacility {
  remarks?: string;
}

export class Facility implements IFacility {
  constructor(public remarks?: string) {
    this.remarks = '';
  }
}
