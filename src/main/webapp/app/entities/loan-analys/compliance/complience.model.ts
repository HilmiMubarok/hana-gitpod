export interface IComplienceReccomendation {
  regulation?: string;
  criteria?: string;
  value?: string;
  remarks?: string;
  analystRecommendation?: string;
}

export class ComplienceRecommendation implements IComplienceReccomendation {
  constructor(
    public regulation?: string,
    public criteria?: string,
    public value?: string,
    public remarks?: string,
    public analystRecommendation?: string,
    public complienceRec?: IComplienceReccomendation[]
  ) {
    this.regulation = '';
    this.value = '';
    this.criteria = '';
    this.remarks = '';
    this.analystRecommendation = '';

    this.complienceRec = [];
  }
}
