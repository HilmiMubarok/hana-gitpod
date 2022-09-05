export interface IDocument {
  id?: number;
  documentDate?: Date;
  documentType?: string;
  documentNumber?: string;
  uploadDate?: Date;
  uploadBy?: string;
  objectName?: string;
}

export class Document implements IDocument {
  constructor(
    public id?: number,
    public docDate?: Date,
    public docType?: string,
    public docNo?: string,
    public uploadDate?: Date,
    public uploadBy?: string,
    public objectName?: string
  ) {}
}
