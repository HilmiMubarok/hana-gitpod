export interface IMasterDocumentTerm {
  id?: number;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  reminderType?: string;
  dpd?: number;
  schedulerEmail?: string;
  schedulerType?: string;
  schedulerDate?: Date;
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
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
    public reminderType?: string,
    public dpd?: number,
    public schedulerEmail?: string,
    public schedulerType?: string,
    public schedulerDate?: Date,
    public status?: string
  ) {}
}
