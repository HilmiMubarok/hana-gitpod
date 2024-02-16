import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BankAccountDialogComponent } from './bank-account-dialog.component';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ApplicationPaymentPreferencesService } from 'app/entities/application-payment-preference/application-payment-preference.service';
import {
  ApplicationPaymentPreferences,
  IApplicationPaymentPreferences,
} from 'app/entities/application-payment-preference/application-payment-preference.model';

@Component({
  selector: 'jhi-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss'],
})
export class BankAccountComponent implements OnInit {
  public _creditProposal: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public dataSource: IApplicationPaymentPreferences[] = [];

  public displayColumns: string[] = ['no', 'accountType', 'currency', 'accountName', 'accountNumber', 'action'];

  constructor(public dialog: MatDialog, protected applicationPaymentPreferencesService: ApplicationPaymentPreferencesService) {}

  ngOnInit(): void {
    this.getDataApplicationPaymentReferences();
  }

  getDataApplicationPaymentReferences() {
    this.applicationPaymentPreferencesService.getData(this.creditProposal.id).subscribe(res => {
      this.dataSource = res;
    });
  }

  public openDialog(dataApplicationPayment?: IApplicationPaymentPreferences) {
    if (!dataApplicationPayment) {
      dataApplicationPayment = new ApplicationPaymentPreferences();
    }
    const dialogRef = this.dialog.open(BankAccountDialogComponent, {
      width: '50vw',

      data: {
        creditProposal: this.creditProposal,
        dataPayment: dataApplicationPayment,
        dataPaymentAll: this.dataSource,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.id) {
        this.applicationPaymentPreferencesService.updateData(res.id, res).subscribe();
      } else {
        this.applicationPaymentPreferencesService.createData(res).subscribe();
        this.getDataApplicationPaymentReferences();
      }
    });
  }
}
