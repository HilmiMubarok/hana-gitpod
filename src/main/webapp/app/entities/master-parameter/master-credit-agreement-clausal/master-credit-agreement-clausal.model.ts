export interface IMasterCreditAgreementClausal {
  id?: number;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
  abbreviation?: string;
  sequence?: number;
  parameterCategoryId?: string;
  parameterCategoryDescription?: string;
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: Date;
  lastModifiedDate?: Date;
  code?: string;
  description?: string;
}

export class MasterCreditAgreementClausal implements IMasterCreditAgreementClausal {
  constructor(
    public id?: number,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public abbreviation?: string,
    public sequence?: number,
    public parameterCategoryId?: string,
    public parameterCategoryDescription?: string,
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: Date,
    public lastModifiedDate?: Date,
    public code?: string,
    public description?: string
  ) {}
}
