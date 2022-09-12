export interface ICreditProposalParent {
  segment?: string;
  bookingBranch?: string;
}

export class CreditProposalParent implements ICreditProposalParent {
  constructor(public segment?: string, public bookingBranch?: string) {
    this.segment = '';
    this.bookingBranch = '';
  }
}
