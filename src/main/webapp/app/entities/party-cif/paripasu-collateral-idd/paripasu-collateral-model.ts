export interface IPariPasu {
  applicationId?: number;
  categoryId?: string;
  cifNo?: string;
  currency?: string;
  debtorName?: string;
  id?: number;
  loanType?: string;
  outstanding?: string;
  totalPlafond?: number;
}

export class Paripasu implements IPariPasu {
  constructor(
    public applicationId?: number,
    public categoryId?: string,
    public cifNo?: string,
    public currency?: string,
    public debtorName?: string,
    public id?: number,
    public loanType?: string,
    public outstanding?: string,
    public totalPlafond?: number
  ) {}
}
