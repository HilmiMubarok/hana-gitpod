import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  ApplicationPaymentPreferences,
  IApplicationPaymentPreferences,
} from 'app/entities/application-payment-preference/application-payment-preference.model';
import { ApplicationPaymentPreferencesService } from 'app/entities/application-payment-preference/application-payment-preference.service';
import { IBankAcountModel } from 'app/entities/bank-account/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account/bank-account.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IPaymentType } from 'app/entities/payment-type/payment-type.model';
import { PaymentTypeService } from 'app/entities/payment-type/payment-type.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { BankAccountDialogLoanOperationComponent } from './bank-account-dialog-loan-operation.component';

@Component({
  selector: 'jhi-bank-account-loan-operation',
  templateUrl: './bank-account-loan-operation.component.html',
  styleUrls: ['./bank-account-loan-operation.component.scss'],
})
export class BankAccountLoanOperationComponent implements OnInit, OnChanges {
  public _creditProposal: ICreditProposal;
  public paymentType: IPaymentType[] = [];
  public filteredPaymentType: IPaymentType[] = [];
  public bankAccountData: IBankAcountModel[] = [];
  public parentPath = this.router.url.split('/')[1];

  @Input() isElement: Boolean = false;
  @Input() isLabel: Boolean = false;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public dataSource: IApplicationPaymentPreferences[] = [];

  public displayColumns: string[] = ['no', 'accountType', 'currency', 'accountName', 'accountNumber', 'action'];

  constructor(
    public dialog: MatDialog,
    protected applicationPaymentPreferencesService: ApplicationPaymentPreferencesService,
    private paymentTypeService: PaymentTypeService,
    private bankAccountService: BankAccountService,
    private router: Router
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isElement']) {
      this.isElement = changes['isElement'].currentValue;
    }

    if (changes['isLabel']) {
      this.isLabel = changes['isLabel'].currentValue;
    }
  }

  ngOnInit() {
    this.getDataApplicationPaymentReferences();
    this.getBankAccount();
  }

  getDataApplicationPaymentReferences() {
    this.applicationPaymentPreferencesService.getData(this.creditProposal.id).subscribe(res => {
      this.dataSource = res;
    });
  }

  public openDialog(dataApplicationPayment?: IApplicationPaymentPreferences) {
    let edited = true;
    if (!dataApplicationPayment) {
      dataApplicationPayment = new ApplicationPaymentPreferences();
      edited = false;
    }
    const dialogRef = this.dialog.open(BankAccountDialogLoanOperationComponent, {
      width: '50vw',

      data: {
        creditProposal: this.creditProposal,
        dataPayment: dataApplicationPayment,
        filteredPaymentType: this.filteredPaymentType,
        edit: edited,
        element: this.isElement,
        label: this.isLabel,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.id) {
        this.applicationPaymentPreferencesService.updateData(res.id, res).subscribe();
      } else {
        this.applicationPaymentPreferencesService.createData(res).subscribe();
        this.getDataApplicationPaymentReferences();
        this.getDataApplicationPaymentReferences();
        this.getBankAccount();
      }
    });
  }

  getBankAccount() {
    this.bankAccountService.getBankAccount(this.creditProposal.cif.partyId).subscribe(res => {
      this.bankAccountData = res.body;
      this.getPaymentType();
    });
  }

  getPaymentType() {
    this.paymentTypeService
      .queryFilterBy({
        idAccountTransType: 'LOAN_ACCOUNT',
      })
      .subscribe(res => {
        this.paymentType = res.body;
        this.getPaymentTypeFiltered();
      });
  }

  getPaymentTypeFiltered() {
    if (this.paymentType.length > 0) {
      for (let i = 0; i < this.paymentType.length; i++) {
        const filteredPaymentRef = this.dataSource.filter(obj => obj.paymentTypeId === this.paymentType[i].id);
        if (filteredPaymentRef.length > 0) {
          if (filteredPaymentRef.length < this.bankAccountData.length) {
            this.filteredPaymentType.push(this.paymentType[i]);
          }
        } else {
          this.filteredPaymentType.push(this.paymentType[i]);
        }
      }
    }
  }

  public deletePaymentRef(element) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to Delete this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.applicationPaymentPreferencesService.deleteData(element.id).subscribe(res2 => {
          this.getDataApplicationPaymentReferences();
          this.getBankAccount();
        });
      }
    });
  }

  getAccountName(element: IApplicationPaymentPreferences) {
    const name = this.bankAccountData.find(obj => obj.id === element.bankAccountId);
    if (name) {
      return name.accountName;
    }
    return '';
  }

  conditionReviewDppk() {
    if (this.parentPath === 'review-dppk') {
      return true;
    }
    return false;
  }
}
