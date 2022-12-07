export interface ICPFacilityTable {
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
  Tenor?: string;
}

export class CPFacilityTable implements ICPFacilityTable {
  constructor(
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
    public Tenor?: string
  ) {}
}
