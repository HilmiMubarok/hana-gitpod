import * as uuid from 'uuid';
export interface IDocumentDpdl {
  id?: string;
  rootId?: string; // lvl 0
  parentId?: string; // lvl 1
  documentId?: string; // lvl 2
  documentName?: string; // lvl 2
  category?: string;
  documentDate?: Date;
  status?: string;
  remarks?: string;
  objectName?: string;
}

export class DocumentDpdl implements IDocumentDpdl {
  constructor(
    public id?: string,
    public rootId?: string, // lvl 0
    public parentId?: string, // lvl 1
    public documentId?: string, // lvl 2
    public documentName?: string, // lvl 2
    public category?: string,
    public documentDate?: Date,
    public status?: string,
    public remarks?: string,
    public objectName?: string
  ) {}
}

export interface IDocumentDpdlMetaData {
  id?: string;
  applicationId?: number;
  rootId?: string; // lvl 0
  parentId?: string; // lvl 1
  documentId?: string; // lvl 2
  category?: string;
  remarks?: string;
  status?: string;
  documentDate?: Date;
  objectName?: string;
  attributes?: any;
}

export class DocumentDpdlMetaData implements IDocumentDpdlMetaData {
  constructor(
    public id?: string,
    public applicationId?: number,
    public rootId?: string,
    public parentId?: string,
    public documentId?: string,
    public category?: string,
    public remarks?: string,
    public status?: string,
    public documentDate?: Date,
    public objectName?: string
  ) {
    this.id = null;
    this.applicationId = null;
    this.rootId = null;
    this.parentId = null;
    this.documentId = null;
    this.category = null;
    this.remarks = null;
    this.status = null;
    this.documentDate = null;
    this.objectName = null;
  }
}

export interface IDocumentLegalDpdl {
  id?: string;
  rootId?: string; // lvl 0
  parentId?: string; // lvl 1
  documentId?: string; // lvl 2
  documentName?: string; // lvl 2
  category?: string;
  documentDate?: Date;
  status?: string;
  attributes?: any;
  legalCovernote?: ILegalCovernote;
  objectName?: string;
}

export class DocumentLegalDpdl implements IDocumentLegalDpdl {
  constructor(
    public id?: string,
    public rootId?: string, // lvl 0
    public parentId?: string, // lvl 1
    public documentId?: string, // lvl 2
    public documentName?: string, // lvl 2
    public category?: string,
    public documentDate?: Date,
    public status?: string,
    public attributes?: any,
    public legalCovernote?: ILegalCovernote,
    public objectName?: string
  ) {
    this.attributes = {};
    this.legalCovernote = new ILegalCovernote();
  }
}

export interface IDocumentDpdlLegalMetaData {
  id?: string;
  applicationId?: number;
  rootId?: string; // lvl 0
  parentId?: string; // lvl 1
  documentId?: string; // lvl 2
  category?: string;
  status?: string;
  documentDate?: Date;
  objectName?: string;
  attributes?: any;
}

export class DocumentDpdlLegalMetaData implements IDocumentDpdlLegalMetaData {
  constructor(
    public id?: string,
    public applicationId?: number,
    public rootId?: string,
    public parentId?: string,
    public documentId?: string,
    public category?: string,
    public status?: string,
    public documentDate?: Date,
    public objectName?: string,
    public attributes?: any
  ) {
    this.id = null;
    this.applicationId = null;
    this.rootId = null;
    this.parentId = null;
    this.documentId = null;
    this.category = null;
    this.status = null;
    this.documentDate = null;
    this.objectName = null;
    this.attributes = {}; // Set default value for remarks
  }
}

export class ILegalCovernote {
  constructor(public id?: string, public documentId?: string, public attributes?: ILegalCovernoteAttributes) {
    this.id = '';
    this.documentId = '';
    this.attributes = new ILegalCovernoteAttributes();
  }
}

export class ILegalCovernoteAttributes {
  constructor(public covernoteType?: string, public covernoteTask?: ICovernoteTask[]) {
    this.covernoteType = '';
    this.covernoteTask = [];
  }
}

export class ICovernoteTask {
  constructor(public code?: string, public date?: Date) {
    this.code = '';
    this.date = new Date();
  }
}

export interface IDocLegalMinIO {
  attributes?: any;
  category?: string;
  documentDate?: any;
  documentId?: string;
  documentType?: string;
  files?: any;
  folder?: string;
  id?: string;
  nameFile?: string;
  status?: string;
}
