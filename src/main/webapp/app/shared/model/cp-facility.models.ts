export interface ICPFacility {
  ADMIN_FEE?: string;
  ADMIN_FEE_TYPE?: string;
  AVAILABLE_AMT?: string;
  AVAILABLE_LIMIT?: string;
  CUSTODIAN_FEE?: string;
  CUSTODIAN_FEE_CCY?: string;
  CUSTODIAN_FEE_TYPE?: string;
  FICH22_ADD_MONTH_AP?: string;
  FICH22_APL_COND?: string;
  FICH22_RESTRUCT_STATUS?: string;
  FILN10_CONTRACT_AMT?: string;
  FILN10_INDEX_RT?: string;
  FILN10_KODE_RESTRUKTUR?: string;
  FILN10_LON_CCY?: string;
  FILN10_ROLL_GAP?: string;
  FILN10_ROLL_GAP_GB?: string;
  FILN10_ROLL_GAP_GB_NM?: string;
  FILN10_TOT_EXP_IL?: string;
  FILN10_UNCMIT_USAG?: string;
  FILN11_COM_ID?: string;
  FILN11_COM_NM?: string;
  FILN11_FIX_FLT_GB?: string;
  FILN11_GRACE_DAYS?: string;
  FILN11_LST_RT?: string;
  FILN11_REPAY_GB?: string;
  FILN11_SPREAD_RT?: string;
  FIX_FLT_GB_NM?: string;
  FXFIG_TRX_DT?: string;
  LNB_BASE_AGR_REF_NO?: string;
  LNB_BASE_LON_CCY?: string;
  LNB_BASE_LON_JAN?: string;
  PROVISION_FEE?: string;
  PROVISION_FEE_TYPE?: string;
}

export class CPFacility implements ICPFacility {
  constructor(
    public ADMIN_FEE?: string,
    public ADMIN_FEE_TYPE?: string,
    public AVAILABLE_AMT?: string,
    public AVAILABLE_LIMIT?: string,
    public CUSTODIAN_FEE?: string,
    public CUSTODIAN_FEE_CCY?: string,
    public CUSTODIAN_FEE_TYPE?: string,
    public FICH22_ADD_MONTH_AP?: string,
    public FICH22_APL_COND?: string,
    public FICH22_RESTRUCT_STATUS?: string,
    public FILN10_CONTRACT_AMT?: string,
    public FILN10_INDEX_RT?: string,
    public FILN10_KODE_RESTRUKTUR?: string,
    public FILN10_LON_CCY?: string,
    public FILN10_ROLL_GAP?: string,
    public FILN10_ROLL_GAP_GB?: string,
    public FILN10_ROLL_GAP_GB_NM?: string,
    public FILN10_TOT_EXP_IL?: string,
    public FILN10_UNCMIT_USAG?: string,
    public FILN11_COM_ID?: string,
    public FILN11_COM_NM?: string,
    public FILN11_FIX_FLT_GB?: string,
    public FILN11_GRACE_DAYS?: string,
    public FILN11_LST_RT?: string,
    public FILN11_REPAY_GB?: string,
    public FILN11_SPREAD_RT?: string,
    public FIX_FLT_GB_NM?: string,
    public FXFIG_TRX_DT?: string,
    public LNB_BASE_AGR_REF_NO?: string,
    public LNB_BASE_LON_CCY?: string,
    public LNB_BASE_LON_JAN?: string,
    public PROVISION_FEE?: string,
    public PROVISION_FEE_TYPE?: string
  ) {}
}
