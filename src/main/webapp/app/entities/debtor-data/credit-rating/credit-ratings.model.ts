export interface IDebtorCreditRating {
  id?: number;
  industry?: string;
}

export class DebtorCreditRatings implements IDebtorCreditRating {
  constructor(public id?: number, public industry?: string) {
    this.id = 0;
    this.industry = '';
  }
}
