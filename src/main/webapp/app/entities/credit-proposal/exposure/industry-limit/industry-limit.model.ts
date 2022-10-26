export interface IIndustryLimit {
  date?: string;
  industryLimitExposures?: string;
  limitInFromTotalOS?: string;
  limitInIDR?: string;
  remainingBalance?: string;
  proposeAmount?: string;
  remainingBalanceAfter?: string;
  status?: string;
}

export class IndustryLimit {
  constructor(
    public date?: string,
    public industryLimitExposures?: string,
    public limitInFromTotalOS?: string,
    public limitInIDR?: string,
    public remainingBalance?: string,
    public proposeAmount?: string,
    public remainingBalanceAfter?: string,
    public status?: string
  ) {
    this.date = '';
    this.industryLimitExposures = '';
    this.limitInFromTotalOS = ';';
    this.limitInIDR = '';
    this.remainingBalance = '';
    this.proposeAmount = '';
    this.remainingBalanceAfter = '';
    this.status = '';
  }
}
