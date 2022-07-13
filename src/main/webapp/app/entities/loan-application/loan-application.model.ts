import { IPerson } from '../person/person.model';
import { IPostalAddress } from '../postal-address/postal-address.model';

export interface ILoanApplication {
  id?: number;
  applicationNumber?: string;
  description?: string;
  tenor?: number;
  baseLoan?: number;
  installment?: number;
  interest?: number;
  applicationTypeId?: string;
  applicationTypeDescription?: string;
  internalName?: string;
  internalId?: string;
  financialProductName?: string;
  financialProductId?: number;
  prospectName?: string;
  prospectId?: string;
  spouseName?: string;
  spouseId?: string;
  roles?: any;
  attributes?: any;
  notes?: any[];
  prospectAddress?: IPostalAddress;
  prospect?: IPerson;
  spouse?: IPerson;
  createdDate?: Date;
  statusId?: string;
  statusCode?: string;
  statusDescription?: string;
}

export class LoanApplication implements ILoanApplication {
  constructor(
    public id?: number,
    public applicationNumber?: string,
    public description?: string,
    public tenor?: number,
    public baseLoan?: number,
    public installment?: number,
    public interest?: number,
    public applicationTypeDescription?: string,
    public applicationTypeId?: string,
    public internalName?: string,
    public internalId?: string,
    public financialProductName?: string,
    public financialProductId?: number,
    public prospectName?: string,
    public prospectId?: string,
    public spouseName?: string,
    public spouseId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public roles?: any,
    public attributes?: any,
    public notes?: any[]
  ) {}
}
