import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CustomerType } from 'app/shared/model/enumerations/customer-type.model';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { ICollateral } from '../collateral/collateral.model';

export interface IPartyCif {
  number?: string;
  customerStatus?: string;
  customerType?: CollateralPropertyType;
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
  collaterals?: Array<ICollateral>;
  appraisals?: Array<ICollateralAppraisal>;
  collateralProperties?: Array<ICollateralProperty>;
}

export class PartyCif implements IPartyCif {
  constructor(
    public number?: string,
    public customerStatus?: string,
    public customerType?: CollateralPropertyType,
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
    public collaterals?: Array<ICollateral>,
    public appraisals?: Array<ICollateralAppraisal>,
    public collateralProperties?: Array<ICollateralProperty>
  ) {
    this.collaterals = new Array<ICollateral>();
    this.appraisals = new Array<ICollateralAppraisal>();
    this.collateralProperties = new Array<ICollateralProperty>();
  }
}
