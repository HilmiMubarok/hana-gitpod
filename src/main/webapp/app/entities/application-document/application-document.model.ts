export interface IApplicationDocument {
  id?: number;
  docIdTags?: string; // lvl 0
  documentTypeId?: string; // lvl 0
  documentTypeParent?: string; // lvl 0
  documentTypeCategory?: string; // lvl 1
  documentTypeOrderNo?: string; // lvl 2
  documentTypeStatusId?: string; // lvl 2
  documentTypeCustomerType?: string;
  path?: string;
  documentStatusId?: string;
  name?: string;
  description?: string;
  notes?: string;
  applicationId?: number;
  applicationNumber?: string;
  dueDate?: Date;
  statusAppeal?: string;
  category?: string;
  statusAppDocId?: string;
  initialStatusId?: string;
  date?: Date;
  files?: File[];
  attributes?: any;
}

export class ApplicationDocument implements IApplicationDocument {
  constructor(
    public id?: number,
    public docIdTags?: string, // lvl 1
    public documentTypeId?: string, // lvl 1
    public documentTypeCategory?: string, // lvl 1
    public documentTypeParent?: string, // lvl 1
    public documentTypeOrderNo?: string, // lvl 2
    public documentTypeStatusId?: string, // lvl 2
    public documentTypeCustomerType?: string,
    public path?: string,
    public documentStatusId?: string,
    public name?: string,
    public description?: string,
    public notes?: string,
    public applicationId?: number,
    public applicationNumber?: string,
    public dueDate?: Date,
    public statusAppeal?: string,
    public category?: string,
    public statusAppDocId?: string,
    public initialStatusId?: string,
    public date?: Date,
    public files: File[] = [],
    public attributes?: any
  ) {
    this.attributes = {};
  }
}
