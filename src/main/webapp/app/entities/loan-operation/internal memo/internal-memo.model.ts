export interface IInternalMemoDocument {
  id?: string;
  documentName?: string; // lvl 2
  documentDate?: Date;
  applicationId?: number;
  remarks?: string;
  objectName?: string;
}

export class InternalMemoDocument implements IInternalMemoDocument {
  constructor(
    public id?: string,
    public applicationId?: number,
    public documentName?: string, // lvl 2
    public documentDate?: Date,
    public remarks?: string,
    public objectName?: string
  ) {}
}

export interface IInternalMemoMetaData {
  id?: string;
  applicationId?: number;
  documentName?: string;

  remarks?: string;

  documentDate?: Date;
  objectName?: string;
}

export class InternalMemoDocumentMetaData implements IInternalMemoMetaData {
  constructor(
    public id?: string,
    public applicationId?: number,
    public documentName?: string,

    public remarks?: string,

    public documentDate?: Date,
    public objectName?: string
  ) {
    this.id = null;
    this.applicationId = null;
    this.documentName = null;
    this.remarks = null;

    this.documentDate = null;
    this.objectName = null;
  }
}
