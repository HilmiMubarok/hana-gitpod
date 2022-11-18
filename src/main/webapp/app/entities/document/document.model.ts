export interface IDocumentMetaData {
  objectName?: string;
  entityId?: number;
  docType?: string;
  docDate?: Date;
  docNo?: string;
  folder?: string;
  createdDate?: Date;
  createdBy?: string;
}

export class DocumentMetaData implements IDocumentMetaData {
  constructor(
    public objectName?: string,
    public entityId?: number,
    public docType?: string,
    public docDate?: Date,
    public docNo?: string,
    public folder?: string,
    public createdDate?: Date,
    public createdBy?: string
  ) {
    this.objectName = null;
    this.entityId = null;
    this.docType = null;
    this.docDate = null;
    this.docNo = null;
    this.folder = null;
    this.createdDate = null;
    this.createdBy = null;
  }
}

// --------------------------------------------------------------------------------------------

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
