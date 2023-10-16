import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

import { MatDialog } from '@angular/material/dialog';
import { SignerPerjanjialKreditDialogComponent } from './signer-perjanjian-kredit-dialog/signer-perjanjian-kredit-dialog.component';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'jhi-finalize-credit-agreement',
  templateUrl: './finalize-credit-agreement.component.html',
  styleUrls: ['../credit-agreement.css'],
})
export class FinalizeCreditAgreementComponent {
  public _creditProposal;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(object: ICreditProposal) {
    this._creditProposal = object;
  }
  public data = [];
  public loading: boolean;

  constructor(private dialog: MatDialog, public messageService: MessageService) {
    this.loading = false;
  }
  public openDialog() {
    const dialogRef = this.dialog.open(SignerPerjanjialKreditDialogComponent, {
      data: this.creditProposal.agreements.length > 0 ? this.creditProposal.agreements[0].attributes : '',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        this.creditProposal.agreements.length > 0
          ? (this.creditProposal.agreements[0].attributes = {
              signerAgreement: result,
            })
          : this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data Agreement is empty' });
      }
    });
  }

  public displayColumns = ['No', 'Name', 'Debitor', 'Position', 'Action'];
  public displayColumnsDraftPerjanjianKredit = ['no', 'fileName', 'date', 'createdBy', 'sizeFile', 'action'];
}
