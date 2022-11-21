import * as uuid from 'uuid';

export interface IDocumentChecklistDebtorData {
  id?: string;
  document?: any;
  category?: string;
  dueDate?: Date;
  status?: string;
  remarks?: string;
  documentType?: any;
  files?: any[];
}

export class DocumentChecklistDebtorData implements IDocumentChecklistDebtorData {
  constructor(
    public id?: string,
    public document?: any,
    public category?: string,
    public dueDate?: Date,
    public status?: string,
    public remarks?: string,
    public documentType?: any,
    public files?: any[]
  ) {
    this.id = uuid.v4();
    this.document = '';
    this.category = '';
    this.dueDate = new Date();
    this.status = '';
    this.remarks = '';
    this.files = [];
  }
}
