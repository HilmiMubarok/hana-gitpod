import * as uuid from 'uuid';

export interface ICreditProposalCollateralBinding {
  id?: string;
  collateralId?: number;
  bindingType?: string;
  bindingValue?: number;
}

export class CreditProposalCollateralBinding {
  constructor(public id?: string, public collateralId?: number, public bindingType?: string, public bindingValue?: number) {
    this.id = uuid.v4();
    this.bindingType = '';
    this.bindingValue = 0;
  }
}

// -----------------------------------------------------------------

export interface ICreditProposalCollateralInsurance {
  id?: string;
  collateralId?: number;
  insuranceType?: string;
  insuranceAmount?: number;
}

export class CreditProposalCollateralInsurance {
  constructor(public id?: string, public collateralId?: number, public insuranceType?: string, public insuranceAmount?: number) {
    this.id = uuid.v4();
    this.insuranceAmount = 0;
  }
}
