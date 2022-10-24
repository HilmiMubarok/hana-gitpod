import { CustomerType } from 'app/shared/model/enumerations/customer-type.model';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { ICollateral } from '../collateral/collateral.model';
import { IPerson } from '../person/person.model';
import { IPartyGroup } from '../party-group/party-group.model';
import { DebtorData, IDebtorData } from '../debtor-data/debtor-data.model';
import { ICustomer } from '../customer/customer.model';
import { IPartySlik } from '../party-slik/party-slik.model';
import { ICreditRating } from '../credit-rating/credit-rating.model';

export interface IPartyCif extends ICustomer {
  customerNumber?: string;
  collaterals?: ICollateral[];
  collateralProperties?: Array<ICollateralProperty>;
  collateralCode?: string;
  customerPerson?: IPerson;
  customerOrganization?: IPartyGroup;
  debtorData?: IDebtorData;
  spouse?: IPerson;
  organizationContact?: IPerson;
  sliks?: IPartySlik[];
  creditRatings?: ICreditRating[];
}

export class PartyCif implements IPartyCif {
  constructor(
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
    public attributes?: any,
    public collaterals?: ICollateral[],
    public prospectPerson?: IPerson,
    public prospectOrganization?: IPartyGroup,
    public customerPerson?: IPerson,
    public customerOrganization?: IPartyGroup,
    public appraisals?: Array<ICollateralAppraisal>,
    public collateralProperties?: Array<ICollateralProperty>,
    public collateralCode?: string,
    public debtorData?: IDebtorData,
    public sliks?: IPartySlik[],
    public customerNumber?: string,
    public creditRatings?: ICreditRating[]
  ) {
    this.collaterals = new Array<ICollateral>();
    this.appraisals = new Array<ICollateralAppraisal>();
    this.collateralProperties = new Array<ICollateralProperty>();
    this.debtorData = new DebtorData();
    this.sliks = [];
    this.creditRatings = new Array<ICreditRating>();
  }
}
