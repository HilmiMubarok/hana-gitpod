export interface IDocumentType {
  id?: string;
  code?: string;
  category?: string;
  description?: string;
  orderNo?: number;
  parentId?: string;
  parentCode?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
}

export class DocumentType implements IDocumentType {
  constructor(
    public id?: string,
    public code?: string,
    public category?: string,
    public description?: string,
    public orderNo?: number,
    public parentId?: string,
    public parentCode?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string
  ) {}
}
