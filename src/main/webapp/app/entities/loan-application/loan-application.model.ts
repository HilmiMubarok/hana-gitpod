import { IApplicationRole } from '../application-role/application-role.model';
import { IPerson, Person } from '../person/person.model';
import { IPostalAddress } from '../postal-address/postal-address.model';
import { IApplicationProduct } from '../application-product/application-product.model';
import { IPartyGroup, PartyGroup } from '../party-group/party-group.model';
import { IPosition } from '../position/position.model';

export interface ILoanApplication {
  id?: number;
  customerId?: number;
  customerNumber?: string;
  customerType?: string;
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
  statusInsuranceCode?: string;
  statusInsuranceDescription?: string;
  statusInsuranceId?: string;
  // rm?: IApplicationRole;
  rm?: IPosition;
  creditFacilityId?: number;
  creditFacilityName?: string;
  products?: IApplicationProduct[];
  prospectPerson?: IPerson;
  prospectOrganization?: IPartyGroup;
  bookingBranchId?: string;
  bookingBranchName?: string;
  approvalLc?: string;
  approvalLcDefault?: string;
  ownerPosition?: IPosition;
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
    public statusInsuranceCode?: string,
    public statusInsuranceDescription?: string,
    public statusInsuranceId?: string,
    public roles?: any,
    public attributes?: any,
    public notes?: any[],
    // rm?: IApplicationRole;
    public rm?: IPosition,
    public creditFacilityId?: number,
    public creditFacilityName?: string,
    public products?: IApplicationProduct[],
    public bookingBranchId?: string,
    public bookingBranchName?: string,
    public approvalLc?: string,
    public prospectPerson?: IPerson,
    public prospectOrganization?: IPartyGroup,
    public approvalLcDefault?: string,
    public ownerPosition?: IPosition
  ) {
    this.products = new Array<IApplicationProduct>();
    this.prospectPerson = new Person();
    this.prospectOrganization = new PartyGroup();
  }
}
