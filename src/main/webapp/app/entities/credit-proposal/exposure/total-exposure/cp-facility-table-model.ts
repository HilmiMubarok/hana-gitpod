export interface ICPFacilityTable {
  no?: number;
  LoanAccount?: string;
  GroupName?: string;
  FacilityType?: string;
  InitialLimit?: number;
  Changes?: number;
  OS?: string;
  TotalPlafond?: number;
  InterestRate?: string;
  Provision?: string;
  AdminFee?: string;
  FirstDisbursementDate?: string;
  Tenor?: number;
  LoanType?: string;
  CCY?: string;
}

export class CPFacilityTable implements ICPFacilityTable {
  constructor(
    public no?: number,
    public LoanAccount?: string,
    public GroupName?: string,
    public FacilityType?: string,
    public InitialLimit?: number,
    public Changes?: number,
    public OS?: string,
    public TotalPlafond?: number,
    public InterestRate?: string,
    public Provision?: string,
    public AdminFee?: string,
    public FirstDisbursementDate?: string,
    public Tenor?: number,
    public CCY?: string,
    public LoanType?: string
  ) {}
}
