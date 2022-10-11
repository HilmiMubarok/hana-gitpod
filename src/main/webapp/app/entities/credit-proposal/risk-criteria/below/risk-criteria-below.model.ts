export interface IBelow {
  parameterBelow?: string;
  value?: string;
  status?: string;
  remarks?: string;
  CsRemaks?: string;
  CvRemaks?: string;
  CiRemaks?: string;
  CaRemaks?: string;
  Cs?: string;
  Cv?: string;
  Ci?: string;
  Ca?: string;
  collateralStatus?: string;
  collateralCoverage?: string;
  creditApplication?: string;
  collateralInsurance?: string;
}

export class CpRacBelow implements IBelow {
  constructor(
    public parameterBelow?: string,
    public value?: string,
    public status?: string,

    public remarks?: string,
    public Cv?: string,
    public Cs?: string,
    public Ci?: string,
    public Ca?: string,
    public CsRemaks?: string,
    public CvRemaks?: string,
    public CiRemaks?: string,
    public CaRemaks?: string,
    public collateralStatus?: string,
    public collateralCoverage?: string,
    public creditApplication?: string,
    public collateralInsurance?: string,
    public cpValueBot?: IBelow[],
    // public inputRemaks?: IBelow[],
    public cpValeuTwo?: IBelow[],
    public cpValeuThere?: IBelow[],
    public cpValeuFour?: IBelow[],
    public cpValeuFive?: IBelow[],
    public lovBelow?: IBelow[]
  ) {
    this.parameterBelow = '';
    this.value = '';
    this.status = '';
    this.remarks = '';
    this.Cs = '';
    this.Cv = '';
    this.Ci = '';
    CsRemaks = '';
    CvRemaks = '';
    CiRemaks = '';
    CaRemaks = '';

    this.collateralStatus = '';
    this.collateralCoverage = '';
    this.creditApplication = '';
    this.collateralInsurance = '';

    this.cpValueBot = [];
    // this.inputRemaks = [];
    this.cpValeuTwo = [];
    this.cpValeuThere = [];
    this.cpValeuFour = [];
    this.cpValeuFive = [];
    this.lovBelow = [];
  }
}
