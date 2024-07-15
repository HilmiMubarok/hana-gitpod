export interface ITboLegalMonitoring {
  id?: string;
  rootId?: string; // lvl 0
  parentId?: string; // lvl 1
  documentId?: string; // lvl 2
  documentName?: string; // lvl 2
  category?: string;
  documentDate?: Date;
  date?: Date;
  notes?: string;
  status?: string;
  proposedStatus?: string;
  statusAppDocId?: string;
  initialStatusId?: string;
  proposedDate?: Date;
  dueDate?: Date;
  attributes?: any;
  objectName?: string;
}

export class TboLegalMonitoring implements ITboLegalMonitoring {
  constructor(
    public id?: string,
    public rootId?: string, // lvl 0
    public parentId?: string, // lvl 1
    public documentId?: string, // lvl 2
    public documentName?: string, // lvl 2
    public category?: string,
    public documentDate?: Date,
    public statusAppDocId?: string,
    public initialStatusId?: string,
    public date?: Date,
    public status?: string,
    public proposedStatus?: string,
    public proposedDate?: Date,
    public dueDate?: Date,
    public attributes?: any,
    public objectName?: string,
    public notes?: string
  ) {
    this.attributes = {};
  }
}

export interface ITboLegalMonitoringMetaData {
  id?: string;
  applicationId?: number;
  rootId?: string; // lvl 0
  parentId?: string; // lvl 1
  documentId?: string; // lvl 2
  category?: string;
  // documentTypeParent?: string;
  // remarks?: string;
  // remarksTbo?: string;
  status?: string;
  // proposedStatus?: string;
  // proposedDate?: Date;
  documentDate?: Date;
  objectName?: string;
  attributes?: any;
}

export class TboLegalMonitoringMetaData implements ITboLegalMonitoringMetaData {
  constructor(
    public id?: string,
    public applicationId?: number,
    public rootId?: string,
    public parentId?: string,
    public documentId?: string,
    public category?: string,
    // public documentTypeParent?: string,
    // public remarks?: string,
    // public remarksTbo?: string,
    public status?: string,
    // public proposedStatus?: string,
    // public proposedDate?: Date,
    // public documentDate?: Date,
    public objectName?: string
  ) {
    this.id = null;
    this.applicationId = null;
    this.rootId = null;
    this.parentId = null;
    // this.documentTypeParent = null;
    this.documentId = null;
    this.category = null;
    // this.remarks = null;
    // this.remarksTbo = null;
    this.status = null;
    // this.proposedStatus = null;
    // this.proposedDate = null;
    // this.documentDate = null;
    this.objectName = null;
  }
}
