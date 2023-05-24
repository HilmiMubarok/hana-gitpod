export interface IComplianceChecklistCriteria {
  id?: number;
  regItemNo?: number;
  regulationName?: string;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  itemNo?: number;
  regulationId?: number;
  criteria?: string;
}
export class ComplianceChecklistCriteria implements IComplianceChecklistCriteria {
  constructor(
    public id?: number,
    public regItemNo?: number,
    public regulationName?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
    public itemNo?: number,
    public regulationId?: number,
    public criteria?: string
  ) {}
}
