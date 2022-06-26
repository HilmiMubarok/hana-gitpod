export interface IWorkType {
  id?: string;
  description?: string;
  fixedIncome?: boolean;
  sensitive?: boolean;
}

export class WorkType implements IWorkType {
  constructor(public id?: string, public description?: string, public fixedIncome?: boolean, public sensitive?: boolean) {
    this.fixedIncome = this.fixedIncome || false;
    this.sensitive = this.sensitive || false;
  }
}
