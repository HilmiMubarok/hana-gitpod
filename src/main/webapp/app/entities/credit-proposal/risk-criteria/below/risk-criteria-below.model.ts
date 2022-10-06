export interface IBelow {
  parameterBelow?: string;
  value?: string;
  remaks?: string;
  collateralStatus?: string;
  collateralCoverage?: string;
  creditApplication?: string;
  collateralInsurance?: string;
}

export class CpRacBelow implements IBelow {
  constructor(
    public parameterBelow?: string,
    public value?: string,
    public remaks?: string,
    public collateralStatus?: string,
    public collateralCoverage?: string,
    public creditApplication?: string,
    public collateralInsurance?: string,
    public cpValueBot?: IBelow[],
    public cpValueBelow?: IBelow[],
    public lovBelow?: IBelow[]
  ) {
    this.parameterBelow = '';
    this.value = '';
    this.remaks = '';
    this.collateralStatus = '';
    this.collateralCoverage = '';
    this.creditApplication = '';
    this.collateralInsurance = '';
    this.cpValueBot = [];
    this.cpValueBelow = [];
    this.lovBelow = [];
  }
}
