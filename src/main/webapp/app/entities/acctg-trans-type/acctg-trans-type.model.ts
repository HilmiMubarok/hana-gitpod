export interface IAcctgTransType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class AcctgTransType implements IAcctgTransType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}
