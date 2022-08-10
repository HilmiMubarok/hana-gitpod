import { CustomerType } from 'app/shared/model/enumerations/customer-type.model';
import { IPartyRole } from '../party-role/party-role.model';

export interface ICif extends IPartyRole {
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  number?: string;
  customerStatus?: string;
  customerType?: CustomerType;
  customerId?: string;
  customerName?: string;
  branchId?: string;
  branchName?: string;
  regional?: string;
  segmentBusiness?: string;
  openingBranch?: string;
  riskProfile?: string;
  tinSsnEin?: string;
  attributes?: any;
}

export class Cif implements ICif {
  constructor(
    public createdBy?: string,
    public createdDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
    public id?: number,
    public number?: string,
    public customerStatus?: string,
    public customerType?: CustomerType,
    public customerId?: string,
    public customerName?: string,
    public branchId?: string,
    public branchName?: string,
    public regional?: string,
    public segmentBusiness?: string,
    public openingBranch?: string,
    public riskProfile?: string,
    public tinSsnEin?: string,
    public attributes?: any
  ) {}
}
