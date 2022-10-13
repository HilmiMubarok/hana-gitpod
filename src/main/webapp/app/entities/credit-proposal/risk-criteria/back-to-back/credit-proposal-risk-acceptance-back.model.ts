export interface ICriteria {
  value?: string;
  documentType?: string;
  remarks?: string;
  remarksTwo?: string;
  remarksThere?: string;
  remarksFour?: string;
  remarksFive?: string;
}

export class CpRacBack implements ICriteria {
  constructor(
    public value?: string,
    public documentType?: string,
    public remarks?: string,
    public remarksTwo?: string,
    public remarksThere?: string,
    public remarksFour?: string,
    public remarksFive?: string,
    public topGrid?: ICriteria[],
    public topGridTwo?: ICriteria[],
    public topGridThere?: ICriteria[],
    public topGridFour?: ICriteria[],
    public topGridFive?: ICriteria[],
    public checklistValueBelow?: ICriteria[],
    public checklistValueBelowBot?: ICriteria[]
  ) {
    this.value = '';
    this.documentType = '';
    this.remarks = '';
    this.remarksTwo = '';
    this.remarksThere = '';
    this.remarksFour = '';
    this.remarksFive = '';
    this.topGrid = [];
    this.topGridTwo = [];
    this.topGridThere = [];
    this.topGridFour = [];
    this.topGridFive = [];
    this.checklistValueBelow = [];
    this.checklistValueBelowBot = [];
  }
}
