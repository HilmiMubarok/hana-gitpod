import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICovenant } from 'app/entities/credit-proposal/convenant/convenant.constant';

export interface IPrevious {
  covenant?: ICovenant;
  collateralInfo?: ICollateral[];
  facilityDetail?: any;
  binding?: any;
  insurance?: any;
  appraisals?: any;
}

export class Previous {
  constructor(
    public covenant?: ICovenant,
    public collateralInfo?: ICollateral[],
    public facilityDetail?: any,
    public binding?: any,
    public insurance?: any,
    public appraisals?: any
  ) {}
}
