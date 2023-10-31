import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

import { MatDialog } from '@angular/material/dialog';
import { SignerPerjanjialKreditDialogComponent } from './signer-perjanjian-kredit-dialog/signer-perjanjian-kredit-dialog.component';
import { MessageService } from 'primeng/api';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
import { ReviewHistoryDialogComponent } from '../review-history-dialog/review-history-dialog.component';
@Component({
  selector: 'jhi-finalize-credit-agreement',
  templateUrl: './finalize-credit-agreement.component.html',
  styleUrls: ['../credit-agreement.css'],
})
export class FinalizeCreditAgreementComponent implements OnInit {
  public dataAgreement: any[] = [];
  public approvalDebtor: any[] = [1];
  public postalAdresss: IPostalAddress;
  public valueApprovalDebtor: any[];
  selectedConditions: any[] = []; // Initialize as needed
  approvalDebtorOptions: string[] = [
    'Persetujuan suami dan istri',
    'Persetujuan suami atau istri dengan surat tertulis',
    'Persetujuan belum menikah dengan surat pernyataan',
    'Persetujuan dengan surat perjanjian atau pisah harta',
  ];
  public _creditProposal;
  selectedCondition: any = '';
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
  public displayRevewHistory = ['no', 'approveName', 'position', 'date', 'action'];

  addApproval() {
    if (this.creditProposal.customerType === 'PERSONAL') {
      if (this.approvalDebtor.length < 1) {
        this.approvalDebtor.push({});
        this.selectedConditions.push('');
      }
    } else {
      if (this.approvalDebtor.length < 2) {
        this.approvalDebtor.push({});
        this.selectedConditions.push('');
      }
    }
  }

  deleteApproval(index: number) {
    if (this.approvalDebtor.length > 1) {
      this.approvalDebtor.splice(index, 1);
      this.selectedConditions.splice(index, 1);
    }
  }

  onSelectApprovalCondition(selectedValue: any, index: any) {
    // Handle the change event here
    console.log(`Selected value at index ${index}:`, selectedValue);
    // You can do more with the selected value if needed
  }

  getAvailableOptions(index: number): string[] {
    // Exclude options already selected in previous mat-select instances
    const selectedOptions = this.selectedConditions.slice(0, index);
    return this.approvalDebtorOptions.filter(option => !selectedOptions.includes(option));
  }

  public addReviewHistory(): void {
    const dialogRef = this.dialog.open(ReviewHistoryDialogComponent, {
      data: {
        title: 'Hello Dialog',
        message: 'This is a message from the main component!',
      },
      width: '200vh',
      height: '100vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }

  public addRow() {}
}
