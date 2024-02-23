export interface IApplicationPaymentPreferences {
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  id?: number;
  applicationId?: number;
  applicationNumber?: string;
  bankAccountId?: number;
  bankAccountNumber?: string;
  bankAccountUom?: string;
  bankAccountFinancialInstituteName?: string;
  paymentTypeId?: string;
  paymentTypeDescription?: string;
  currencyId?: string;
  currencyDescription?: string;
  statusId?: string;
  statusDescription?: string;
}

export class ApplicationPaymentPreferences implements IApplicationPaymentPreferences {
  constructor(
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
    public id?: number,
    public applicationId?: number,
    public applicationNumber?: string,
    public bankAccountId?: number,
    public bankAccountNumber?: string,
    public bankAccountUom?: string,
    public bankAccountFinancialInstituteName?: string,
    public paymentTypeId?: string,
    public paymentTypeDescription?: string,
    public currencyId?: string,
    public currencyDescription?: string,
    public statusId?: string,
    public statusDescription?: string
  ) {}
}
