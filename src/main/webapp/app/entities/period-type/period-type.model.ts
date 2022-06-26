export interface IPeriodType {
  id?: string;
  description?: string;
  parentDescription?: string;
  parentId?: string;
}

export class PeriodType implements IPeriodType {
  constructor(public id?: string, public description?: string, public parentDescription?: string, public parentId?: string) {}
}
