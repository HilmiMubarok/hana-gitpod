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

// ---------------------------------------------------------------------

export interface ICreditProposalCollateralData {
  crossCollateralStatus?: string;
}

export class CreditProposalCollateralData {
  constructor(public crossCollateralStatus?: string) {
    this.crossCollateralStatus = '';
  }
}

// export
export interface ICreditProposalCollateralCoverage {
  mvInternal?: number;
  lvInternal?: number;
  mvKjjpCoverage?: number;
  lvKjjpCoverage?: number;
}

//
export class CoverageTotal implements ICreditProposalCollateralCoverage {
  constructor(
    public mvInternalCoverage?: number,
    public lvInternalCoverage?: number,
    public mvKjjpCoverage?: number,
    public lvKjjpCoverage?: number,
    public countTotalMV?: number,
    public countTotalLV?: number,
    public countTotalMVKJJP?: number,
    public countTotalLVKJJP?: number,
    public creditLimit?: number
  ) {
    this.mvInternalCoverage = 0;
    this.lvInternalCoverage = 0;
    this.mvKjjpCoverage = 0;
    this.lvKjjpCoverage = 0;
    this.creditLimit = 0;
    this.countTotalLV = 0;
    this.countTotalMVKJJP = 0;
    this.countTotalLVKJJP = 0;
    this.creditLimit = 0;
  }
}
