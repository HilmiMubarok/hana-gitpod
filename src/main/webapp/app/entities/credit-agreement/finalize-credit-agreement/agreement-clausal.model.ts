export interface ICreditAgreementClausal {
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  id?: number;
  agreementId?: string;
  agreementNumber?: string;
  agreementClausalParameterId?: number;
  agreementClausalParameterDescription?: string;
  notes?: string;
  category?: string;
}

export class CreditAgreementClausal implements ICreditAgreementClausal {
  constructor(
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
    public id?: number,
    public agreementId?: string,
    public agreementNumber?: string,
    public agreementClausalParameterId?: number,
    public agreementClausalParameterDescription?: string,
    public notes?: string,
    public category?: string
  ) {
    this.createdBy = '';
    this.createdDate = new Date();
    this.lastModifiedBy = '';
    this.lastModifiedDate = new Date();
    this.id = 0;
    this.agreementId = '';
    this.agreementNumber = '';
    this.agreementClausalParameterId = 0;
    this.agreementClausalParameterDescription = '';
    this.notes = '';
    this.category = '';
  }
}
