import { CustomerType } from 'app/shared/model/enumerations/customer-type.model';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { ICollateralProperty } from '../collateral-property/collateral-property.model';
import { ICollateral } from '../collateral/collateral.model';
import { ILoanApplication } from '../loan-application/loan-application.model';

export interface IPartyCif extends ILoanApplication {
  collaterals?: Array<ICollateral>;
  appraisals?: Array<ICollateralAppraisal>;
  collateralProperties?: Array<ICollateralProperty>;
  collateralCode?: string;
}

export class PartyCif implements IPartyCif {
  constructor(
    public id?: number,
    public number?: string,
    public customerStatus?: string,
    public customerType?: CustomerType,
    public customerId?: number,
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
    public collateralProperties?: Array<ICollateralProperty>,
    public collateralCode?: string
  ) {
    this.collaterals = new Array<ICollateral>();
    this.appraisals = new Array<ICollateralAppraisal>();
    this.collateralProperties = new Array<ICollateralProperty>();
  }
}
