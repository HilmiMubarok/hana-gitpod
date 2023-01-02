import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model';

export interface IGroupCollateral {
  collaterals?: ICollateral[];
  debtorData?: IDebtorData;
}

export class GroupCollateral implements IGroupCollateral {
  constructor(public collaterals?: ICollateral[], public debtorData?: IDebtorData) {}
}
