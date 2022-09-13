import * as uuid from 'uuid';

export interface IDocumentChecklist {
  id?: string;
  document?: any;
  category?: string;
  dueDate?: Date;
  status?: string;
  remarks?: string;
}

export class DocumentChecklist {
  constructor(
    public id?: string,
    public document?: any,
    public category?: string,
    public dueDate?: Date,
    public status?: string,
    public remarks?: string
  ) {
    this.id = uuid.v4();
    this.document = '';
    this.category = '';
    this.dueDate = new Date();
    this.status = '';
    this.remarks = '';
  }
}
