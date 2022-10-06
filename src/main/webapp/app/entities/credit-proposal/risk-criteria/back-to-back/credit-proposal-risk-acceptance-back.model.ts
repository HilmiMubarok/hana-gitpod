export interface ICriteria {
  value?: string;
  documentType?: string;
  remaks?: string;
}

export class CpRacBack implements ICriteria {
  constructor(
    public value?: string,
    public documentType?: string,
    public remaks?: string,
    public topGrid?: ICriteria[],
    public checklistValueBelow?: ICriteria[],
    public checklistValueBelowBot?: ICriteria[]
  ) {
    this.value = '';
    this.documentType = '';
    this.remaks = '';
    this.topGrid = [];
    this.checklistValueBelow = [];
    this.checklistValueBelowBot = [];
  }
}
