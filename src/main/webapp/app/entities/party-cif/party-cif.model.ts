import { CustomerType } from 'app/shared/model/enumerations/customer-type.model';

export interface IPartyCif {
  id?: number;
  number?: string;
  customerStatus?: string;
  customerType?: CustomerType;
  partyName?: string;
  partyId?: string;
  branchName?: string;
  branchId?: string;
  attributes?: any;
}

export class PartyCif implements IPartyCif {
  constructor(
    public id?: number,
    public number?: string,
    public customerStatus?: string,
    public customerType?: CustomerType,
    public partyName?: string,
    public partyId?: string,
    public branchName?: string,
    public branchId?: string,
    public attributes?: any
  ) {}
}
