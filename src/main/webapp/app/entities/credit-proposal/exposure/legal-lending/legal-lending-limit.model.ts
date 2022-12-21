export interface LegalLendingLimit {
  legalLendingLimitType?: string;
  legalLendingLimitValue?: number;
  totalExposureDebtorGroup?: number;
  modalIntiUtama?: number;
  buffer?: number;
  status?: string;
}

export class LegalLendingLimit {
  constructor(
    public legalLendingLimitType?: string,
    public legalLendingLimitValue?: number,
    public totalExposureDebtorGroup?: number,
    public modalIntiUtama?: number,
    public buffer?: number,
    public status?: string
  ) {
    this.legalLendingLimitType = '';
    this.legalLendingLimitValue = 0;
    this.totalExposureDebtorGroup = 0;
    this.modalIntiUtama = 0;
    this.buffer = 0;
    this.status = '';
  }
}
