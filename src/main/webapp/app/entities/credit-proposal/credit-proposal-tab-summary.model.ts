export interface IProposalSummary {
  message?: string;
}

export class CreditTabSummary implements IProposalSummary {
  constructor(public message?: string, public TabSummary?: IProposalSummary[]) {
    this.message = '<p>Strength :</p><br/><p>Opportunities : </p><br/><p>Weaknesses :</p><br/><p>Threats :</p>';
    this.TabSummary = [];
  }
}
