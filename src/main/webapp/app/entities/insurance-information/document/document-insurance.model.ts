import * as uuid from 'uuid';

export interface IDocumentInsurance {
  id?: string;
  document?: any;
  category?: string;
  dueDate?: any;
  status?: string;
  remarks?: string;
  documentType?: any;
}

export class DocumentInsurance {
  constructor(
    public id?: string,
    public document?: any,
    public category?: string,
    public dueDate?: any,
    public status?: string,
    public remarks?: string,
    public documentType?: any
  ) {
    this.id = uuid.v4();
    this.document = '';
    this.category = '';
    this.dueDate = new Date();
    this.status = '';
    this.remarks = '';
  }
}
