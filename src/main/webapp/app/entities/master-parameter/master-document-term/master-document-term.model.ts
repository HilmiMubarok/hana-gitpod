export interface IMasterDocumentTerm {
  id?: number;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: Date;
  lastModifiedDate?: Date;
  reminderType?: string;
  dpd?: number;
  schedulerEmail?: string;
  schedulerType?: string;
  schedulerDate?: string;
  status?: string;
}

export class MasterDocumentTerm implements IMasterDocumentTerm {
  constructor(
    public id?: number,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: Date,
    public lastModifiedDate?: Date,
    public reminderType?: string,
    public dpd?: number,
    public schedulerEmail?: string,
    public schedulerType?: string,
    public schedulerDate?: string,
    public status?: string
  ) {}
}
