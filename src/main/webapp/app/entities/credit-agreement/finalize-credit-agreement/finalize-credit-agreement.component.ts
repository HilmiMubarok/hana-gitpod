import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

import { MatDialog } from '@angular/material/dialog';
import { SignerPerjanjialKreditDialogComponent } from './signer-perjanjian-kredit-dialog/signer-perjanjian-kredit-dialog.component';
import { MessageService } from 'primeng/api';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
@Component({
  selector: 'jhi-finalize-credit-agreement',
  templateUrl: './finalize-credit-agreement.component.html',
  styleUrls: ['../credit-agreement.css'],
})
export class FinalizeCreditAgreementComponent implements OnInit {
  public dataAgreement: any[] = [];
  public postalAdresss: IPostalAddress;
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

  ngOnInit(): void {
    this.postalAdresss = this.creditProposal.addresses.find(function (e) {
      return e.purposeTypeId === 'PRIMARY_LOCATION';
    });
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  public uploadFile() {
    console.log('ok', this.selectedFile);
  }

  public openDialog() {
    const dialogRef = this.dialog.open(SignerPerjanjialKreditDialogComponent, {
      data: this.creditProposal.agreements.length > 0 ? this.creditProposal.agreements[0].attributes : '',
      width: '120vh', // Ganti nilai ini sesuai kebutuhan lebar dialog
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== null && result !== undefined) {
        if (this.creditProposal.agreements.length > 0) {
          this.dataAgreement = [...this.dataAgreement, result];

          this.creditProposal.agreements[0].attributes = {
            signerAgreement: JSON.stringify(this.dataAgreement),
          };
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Data Agreement is empty' });
        }
      }
    });
  }

  public displayColumns = ['No', 'Name', 'Debitor', 'Position', 'Action'];
  public displayColumnsDraftPerjanjianKredit = ['no', 'fileName', 'date', 'createdBy', 'sizeFile', 'action'];
}
