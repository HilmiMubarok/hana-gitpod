import * as uuid from 'uuid';

export interface ILoanAnalysSlikIdeb {
  id?: string;
  data?: string;
  atasNama?: string;
  file?: any;
}

export class LoanAnalysSlikIdeb {
  constructor(public id?: string, public data?: string, public atasNama?: string, public file?: any) {
    this.id = uuid.v4();
    this.data = '';
    this.atasNama = '';
    this.file = '';
  }
}
