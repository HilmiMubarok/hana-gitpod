import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICreditProposal } from '../credit-proposal.model';
import { CreditProposalBankAccountAnalystDialogComponent } from './bank-account-analyst-dialog.component';
import { BankAccountAnalyst, IBankAccountAnalyst } from './bank-account-analyst.model';

@Component({
  selector: 'jhi-credit-proposal-bank-account-analyst',
  templateUrl: './bank-account-analyst.component.html',
})
export class CreditProposalBankAccountAnalystComponent {
  private _creditProposal: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  public displayedColumns: string[] = ['no', 'bank', 'accNo', 'accName', 'ccy', 'debit', 'fqDebit', 'credit', 'fqCredit', 'balance'];
  constructor(public dialog: MatDialog) {}

  public openDialog(element: IBankAccountAnalyst = null): void {
    const predicate = { width: '80vw', data: {} };
    if (element) {
      predicate.data['bankAccountAnalyst'] = element;
    } else {
      predicate.data['bankAccountAnalyst'] = new BankAccountAnalyst();
    }

    const dialogRef = this.dialog.open(CreditProposalBankAccountAnalystDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.creditProposal.attributes['bankAnalyst'] = [...this.creditProposal.attributes['bankAnalyst'], res];
      }
    });
  }
}
