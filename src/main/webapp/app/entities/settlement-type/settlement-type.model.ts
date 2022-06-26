export interface ISettlementType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class SettlementType implements ISettlementType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}
