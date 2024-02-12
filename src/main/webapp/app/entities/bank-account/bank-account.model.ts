export interface IBankAcountModel {
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  id?: number;
  accountNumber?: string;
  description?: string;
  balance?: number;
  sequence?: number;
  statusId?: string;
  statusDescription?: string;
  accountTypeId?: string;
  ownerId?: string;
  internalId?: string;
  attributes?: {};
  currencyId?: string;
  currencyDescription?: string;
  finInstituteId?: number;
  finInstituteCode?: string;
  finInstituteName?: string;
  accountName?: string;
}

export class BankAccountModel implements IBankAcountModel {
  constructor(
    public createdBy?: string,
    public createdDate?: string,
    public lastModifiedBy?: string,
    public lastModifiedDate?: string,
    public id?: number,
    public accountNumber?: string,
    public description?: string,
    public balance?: number,
    public sequence?: number,
    public statusId?: string,
    public statusDescription?: string,
    public accountTypeId?: string,
    public ownerId?: string,
    public internalId?: string,
    public attributes?: {},
    public currencyId?: string,
    public currencyDescription?: string,
    public finInstituteId?: number,
    public finInstituteCode?: string,
    public finInstituteName?: string,
    public accountName?: string
  ) {}
}
