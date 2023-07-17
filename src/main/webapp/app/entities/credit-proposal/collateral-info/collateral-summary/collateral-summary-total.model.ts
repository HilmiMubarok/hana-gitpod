export interface ICollateralSummary {
  mvInternal?: number;
  lvInternal?: number;
  mvKjjpCoverage?: number;
  lvKjjpCoverage?: number;
  biddingValueSum?: number;
  biddingValueCoverage?: number;
}

//
export class CollateralSummary implements ICollateralSummary {
  constructor(
    public mvInternalCoverage?: number,
    public lvInternalCoverage?: number,
    public mvKjjpCoverage?: number,
    public lvKjjpCoverage?: number,
    public countTotalMV?: number,
    public countTotalLV?: number,
    public countTotalMVKJJP?: number,
    public countTotalLVKJJP?: number,
    public creditLimit?: number,
    public biddingValueSum?: number,
    public biddingValueCoverage?: number
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
    this.biddingValueSum = 0;
    this.biddingValueCoverage = 0;
  }
}
