export interface IListOfValueIndustry {
  id?: number;
  label?: string;
}

export class ListOfValueIndustry implements IListOfValueIndustry {
  constructor(public id?: number, public label?: string) {}
}
