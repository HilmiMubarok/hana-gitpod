export interface IFacility {
  remarks?: string;
  custodianRate?: string;
  custodianFee?: string;
}

export class Facility implements IFacility {
  constructor(public remarks?: string, public custodianRate? : string, public custodianFee?: string) {
    this.remarks = '';
    this.custodianRate = 'Amount IDR';
    this.custodianFee = '';
  }
}