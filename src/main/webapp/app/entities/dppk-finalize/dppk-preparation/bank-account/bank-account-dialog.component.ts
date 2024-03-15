import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IApplicationPaymentPreferences } from 'app/entities/application-payment-preference/application-payment-preference.model';
import { ApplicationPaymentPreferencesService } from 'app/entities/application-payment-preference/application-payment-preference.service';
import { IBankAcountModel } from 'app/entities/bank-account/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account/bank-account.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IPaymentType } from 'app/entities/payment-type/payment-type.model';
import { PaymentTypeService } from 'app/entities/payment-type/payment-type.service';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { UOM_TYPE } from 'app/shared/constants/base.constants';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'jhi-bank-account-dialog',
  templateUrl: './bank-account-dialog.component.html',
  styleUrls: ['./bank-account-dialog.component.scss'],
})
export class BankAccountDialogComponent implements OnInit {
  public listOfValue = {
    accountName: ['hilmi', 'anjar', 'obet'],
    bankName: ['Bank Hilmi', 'Bank Anjar'],
    currencyList: ['IDR', 'USD'],
    accountType: ['Hutang', 'pelunasan'],
  };

  public paymentType: IPaymentType[] = [];
  public dataFilteredPaymentType: IPaymentType[] = [];
  public bankAccountData: IBankAcountModel[] = [];
  public filteredBankAccount: IBankAcountModel[] = [];
  public filteredBankAccountCurrency: IBankAcountModel[] = [];
  public currencyData: IUom[] = [];
  public creditProposal: ICreditProposal;
  public accountName: string;
  public dataApplicationPayment: IApplicationPaymentPreferences;
  public dataApplicationPaymentAll: IApplicationPaymentPreferences[] = [];
  public editStat = true;
  public parentPath = this.router.url.split('/')[1];
  public selectedMenu: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      creditProposal: ICreditProposal;
      dataPayment: IApplicationPaymentPreferences;
      filteredPaymentType: IPaymentType[];
      edit: boolean;
    },
    public dialog: MatDialog,
    private _dialog: MatDialogRef<BankAccountDialogComponent>,
    private paymentTypeService: PaymentTypeService,
    private bankAccountService: BankAccountService,
    private uomService: UomService,
    protected applicationPaymentPreferencesService: ApplicationPaymentPreferencesService,
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService
  ) {
    this.creditProposal = data.creditProposal;
    this.dataApplicationPayment = data.dataPayment;
    this.dataFilteredPaymentType = data.filteredPaymentType;
    this.editStat = data.edit;
    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.selectedMenu = subRoute;
      }
    });
  }

  ngOnInit(): void {
    this.getUomCurrrencyLov();
    this.getPaymentType();
    this.getBankAccount();
  }

  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }

  public close() {
    this._dialog.close();
  }

  public onSave() {
    if (!this.dataApplicationPayment.paymentTypeId) {
      this.addMessage('Account Type');
    } else if (!this.dataApplicationPayment.currencyId) {
      this.addMessage('Currency');
    } else if (!this.dataApplicationPayment.bankAccountId) {
      this.addMessage('Bank Name');
    } else {
      this._dialog.close(this.dataApplicationPayment);
    }
  }

  getPaymentType() {
    this.paymentTypeService
      .queryFilterBy({
        idAccountTransType: 'LOAN_ACCOUNT',
      })
      .subscribe(res => {
        this.paymentType = res.body;
        if (this.editStat) {
          this.dataFilteredPaymentType = res.body;
        }
      });
  }

  getBankAccount() {
    this.bankAccountService.getBankAccount(this.creditProposal.cif.partyId).subscribe(res => {
      this.bankAccountData = res.body;
      if (this.editStat) {
        this.changePaymentType(this.dataApplicationPayment.paymentTypeId);
      }
    });
  }

  getUomCurrrencyLov() {
    this.uomService
      .queryFilterBy({
        idUomType: UOM_TYPE.CURRENCY,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.currencyData = res.body.filter(obj => obj.id === 'IDR' || obj.id === 'USD');
      });
  }

  public changeBankAccount(value) {
    const data: IBankAcountModel = this.bankAccountData.find(obj => obj.id === value);
    this.accountName = data.accountName;
    this.getAccountName();
    this.dataApplicationPayment.currencyId = data.currencyId;
    this.dataApplicationPayment.bankAccountId = data.id;
    this.dataApplicationPayment.applicationId = this.creditProposal.id;
    this.dataApplicationPayment.bankAccountFinancialInstituteName = data.finInstituteName;
    this.dataApplicationPayment.bankAccountNumber = data.accountNumber;
  }

  public changeCurrency(value) {
    this.filteredBankAccountCurrency = this.filteredBankAccount.filter(obj => obj.currencyId === value);
  }

  public changePaymentType(value) {
    this.filteredBankAccount = [];
    this.applicationPaymentPreferencesService.filterData(this.creditProposal.id, value).subscribe(res => {
      const filteredRes: IApplicationPaymentPreferences[] = res.filter(obj => obj.statusId === 'ACTIVE');
      if (this.bankAccountData.length > 0) {
        for (let i = 0; i < this.bankAccountData.length; i++) {
          const filteredPaymentAccount = filteredRes.find(obj => obj.bankAccountId === this.bankAccountData[i].id);
          if (!filteredPaymentAccount) {
            this.filteredBankAccount.push(this.bankAccountData[i]);
          }
        }
        if (this.editStat) {
          const bankAccountEditFind = this.bankAccountData.find(obj => obj.id === this.dataApplicationPayment.bankAccountId);
          if (bankAccountEditFind) {
            this.accountName = bankAccountEditFind.accountName;
            this.filteredBankAccount.push(bankAccountEditFind);
            this.changeCurrency(this.dataApplicationPayment.currencyId);
          }
        }
      }
    });
  }

  public getAccountName() {
    if (this.accountName) {
      return this.accountName;
    }
    return '';
  }

  conditionReviewDppk() {
    if (this.parentPath === 'review-dppk') {
      return true;
    }
    return false;
  }

  public checkBankAccount() {
    if (this.bankAccountData.length > 0) {
      return false;
    }
    return true;
  }

  public addMessage(value: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error!',
      detail: 'Please fill in ' + value + ' field first ',
    });
  }
}
