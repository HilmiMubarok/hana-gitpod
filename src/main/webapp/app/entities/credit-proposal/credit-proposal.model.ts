import { IProcessTask } from 'app/shared/model/process-task.model';
import { ICif } from '../cif/cif.model';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { ICollateral } from '../collateral/collateral.model';
import { ICommEvent } from '../comm-event/comm-event.model';
import { ICreditRating } from '../credit-rating/credit-rating.model';
import { IDebtorData } from '../debtor-data/debtor-data.model';
import { ILoanApplication } from '../loan-application/loan-application.model';
import { INotes } from '../notes/notes.model';
import { IOrganizationFinancial } from '../organization-financial/organization-financial.model';
import { IOrganizationLegal } from '../organization-legal/organization-legal.model';
import { IOrganizationManagement } from '../organization-management/organization-management.model';
import { IPartyGroup } from '../party-group/party-group.model';
import { IPartyIdentification } from '../party-identification/party-identification.model';
import { IPartyPaymentPref } from '../party-payment-pref/party-payment-pref.model';
import { IPartyPostalAddress } from '../party-postal-address/party-postal-address.model';
import { IPartySlik } from '../party-slik/party-slik.model';
import { IPerson } from '../person/person.model';
import { IManagementInfo } from './credit-proposal-tab-management-info.model';
import { ICollateralProductRelation } from '../collateral-product-relation/collateral-product-relation.model';
import { IApplicationProduct } from '../application-product/application-product.model';
import { IMainFacility } from '../main-facility/main-facility.model';
import { IPosition } from '@syncfusion/ej2-angular-grids';
import { IPositions } from 'app/shared/integration/models/positions-page.model';
import { ILoanAgreement } from '../loan-agreement/loan-agreement.model';
import { IEntityProperties } from '../entity-properties/entity-properties.model';

export interface ICreditProposal extends ILoanApplication {
  credatedBy?: string;
  credatedDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
  contact?: IPerson;
  cif?: ICif;
  addresses?: IPartyPostalAddress[];
  debtorData?: IDebtorData;
  paymentPrefs?: IPartyPaymentPref[];
  commEvents?: ICommEvent[];
  identifications?: IPartyIdentification[];
  financial?: IOrganizationFinancial;
  legal?: IOrganizationLegal;
  managements?: IOrganizationManagement[];
  creditRatings?: ICreditRating[];
  collaterals?: ICollateral[];
  appraisals?: ICollateralAppraisal[];
  sliks?: IPartySlik[];
  tasks?: IProcessTask[];
  partyTypeId?: string;
  setCompliance?: any;
  notes?: INotes[];
  collateralProductRelations?: ICollateralProductRelation[];
  products?: IApplicationProduct[];
  groupProducts?: IApplicationProduct[];
  intarnalId?: string;
  mainProducts?: IMainFacility[];
  ownerPosition?: IPositions;
  umkmClass?: string;
  annualSales?: number;
  capitalDeposit?: number;
  debtorCategory?: string;
  oLFinalDocNo?: string;
  agreements?: ILoanAgreement[] | [];
  entityProperties?: IEntityProperties[];
  properties?: IEntityProperties[];
  listOfPic?: any[];
}

export class CreditProposal implements ICreditProposal {
  constructor(
    public debtorCategory?: string,
    public umkmClass?: string,
    public annualSales?: number,
    public capitalDeposit?: number,
    public credatedBy?: string,
    public credatedDate?: Date,
    public lastModifiedBy?: string,
    public lastModifiedDate?: Date,
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
    public setCompliance?: any,
    public spouseName?: string,
    public spouseId?: string,
    public statusId?: string,
    public statusCode?: string,
    public statusDescription?: string,
    public statusDocumentId?: string,
    public roles?: any,
    public attributes?: any,
    public notes?: INotes[],
    public prospectPerson?: IPerson,
    public spouse?: IPerson,
    public prospectOrganization?: IPartyGroup,
    public contact?: IPerson,
    public commEvents?: ICommEvent[],
    public identifications?: IPartyIdentification[],
    public financial?: IOrganizationFinancial,
    public legal?: IOrganizationLegal,
    public managements?: IOrganizationManagement[],
    public creditRatings?: ICreditRating[],
    public collaterals?: ICollateral[],
    public appraisals?: ICollateralAppraisal[],
    public sliks?: IPartySlik[],
    public tasks?: IProcessTask[],
    public partyTypeId?: string,
    public debtorData?: IDebtorData,
    public addresses?: IPartyPostalAddress[],
    public customerId?: number,
    public customerNumber?: string,
    public customerType?: string,
    public cif?: ICif,
    public collateralProductRelations?: ICollateralProductRelation[],
    public products?: IApplicationProduct[],
    public groupProducts?: IApplicationProduct[],
    public intarnalId?: string,
    public bookingBranchId?: string,
    public bookingBranchName?: string,
    public mainProducts?: IMainFacility[],
    public agreements?: ILoanAgreement[],
    public entityProperties?: IEntityProperties[]
  ) {
    this.setCompliance = null;
    this.creditRatings = new Array<ICreditRating>();
    this.appraisals = new Array<ICollateralAppraisal>();
  }
}
