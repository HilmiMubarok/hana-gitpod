export interface IDebtorData {
  id?: number;
  partyId?: string;
  attributes?: any;
}

export class DebtorData implements IDebtorData {
  constructor(public id?: number, public partyId?: string, public attributes?: any) {}
}
