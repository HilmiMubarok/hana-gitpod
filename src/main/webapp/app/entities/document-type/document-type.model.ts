interface ILevel {
  id?: string;
  category?: string;
  description?: string;
  orderNo?: number;
  parentId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  customerType?: string;
  idFile?: string;
  name?: string;
  remarks?: string;
  status?: string;
  dueDate?: string;
}

export interface IDocumentType extends ILevel {
  id?: string;
  category?: string;
  description?: string;
  orderNo?: number;
  parentId?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  customerType?: string;
  level?: ILevel[];
}

export class DocumentType implements IDocumentType {
  constructor(
    public id?: string,
    public category?: string,
    public description?: string,
    public orderNo?: number,
    public parentId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public customerType?: string
  ) {
    this.id = '';
    this.category = '';
    this.description = '';
    (this.orderNo = 0), (this.parentId = '');
    this.statusId = '';
    this.statusCode = '';
    this.statusDescription = '';
    this.customerType = '';
  }
}
