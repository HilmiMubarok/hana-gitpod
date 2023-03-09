export interface IDocumentType {
  id?: string;
  category?: string;
  description?: string;
  orderNo?: number;
  parentId?: string;
  parentDescription?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  customerType?: string;
  rootId?: string;
  rootDescription?: string;
}

export class DocumentType implements IDocumentType {
  constructor(
    public id?: string,
    public category?: string,
    public description?: string,
    public orderNo?: number,
    public parentId?: string,
    public parentDescription?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public customerType?: string,
    public rootId?: string,
    public rootDescription?: string
  ) {}
}
