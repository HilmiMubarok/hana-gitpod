import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { CreditProposalTradeCheckingSupplierDialogComponent } from './credit-proposal-trade-checking-supplier-dialog.component';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { CreditProposalService } from '../../credit-proposal.service';
import { ITradeCheckingSupplier, TradeCheckingSupplier } from './trade-checking-supplier.model';
import { CreditProposalTradeCheckingSupplierDialogEditComponent } from './edit/credit-proposal-trade-checking-supplier-dialog-edit.component';

@Component({
  selector: 'jhi-trade-checking-supplier',
  templateUrl: './credit-proposal-trade-checking-supplier.component.html',
  styleUrls: ['../trade-checking.scss'],
})
export class CreditProposalTradeCheckingSupplierComponent implements OnChanges {
  public loading: boolean;

  private _creditProposal: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(object: ICreditProposal) {
    this._creditProposal = object;
  }

  public displayColumns: string[] = [
    'no',
    'suppliersName',
    'termsOfPayment',
    'relationshipSince',
    'purchase',
    'reflection',
    'contact',
    'explanation',
    'action',
  ];

  private loanApplication: ILoanApplication;
  constructor(public dialog: MatDialog, private loanApplicationService: LoanApplicationService) {
    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['creditProposal']) {
      this.getLoanApplication();
    }
  }

  private getLoanApplication(): void {
    this.loanApplicationService.find(this.creditProposal.id).subscribe(res => {
      this.loanApplication = res.body;
    });
  }

  // Add And Detail
  public openDialog(element: ITradeCheckingSupplier = null): void {
    const predicate = { width: '80vw', data: { object: this.creditProposal } };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['tradeCheckingSupplier'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['tradeCheckingSupplier'] = new TradeCheckingSupplier();
    }
    const dialogRef = this.dialog.open(CreditProposalTradeCheckingSupplierDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loanApplication.attributes['tradeCheckingSupplier'] = [...this.creditProposal.attributes['tradeCheckingSupplier'], res];
        this.creditProposal.attributes['tradeCheckingSupplier'] = [...this.creditProposal.attributes['tradeCheckingSupplier'], res];
      }
    });
  }

  // Edit
  public editDialog(element: ITradeCheckingSupplier = null): void {
    const predicate = { width: '80vw', data: {} };
    predicate.data['edit'] = true;
    if (element) {
      predicate.data['tradeCheckingSupplier'] = element;
      predicate.data['edit'] = true;
    } else {
      predicate.data['tradeCheckingSupplier'] = new TradeCheckingSupplier();
    }

    const dialogRef = this.dialog.open(CreditProposalTradeCheckingSupplierDialogEditComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      const supplierIndex: number = lodash.findIndex(
        this.creditProposal.attributes['tradeCheckingSupplier'],
        function (o: ITradeCheckingSupplier) {
          return o.id === res['tradeCheckingSupplier'].id;
        }
      );
      if (supplierIndex > -1) {
        this.creditProposal.attributes['tradeCheckingSupplier'][supplierIndex] = res['tradeCheckingSupplier'];
      } else {
        this.creditProposal.attributes['tradeCheckingSupplier'] = [
          ...this.creditProposal.attributes['tradeCheckingSupplier'],
          res['tradeCheckingSupplier'],
        ];
      }
    });
  }

  // DELETE
  public onDelete(element: ICreditProposal) {
    const dataGrid = this.creditProposal.attributes['tradeCheckingSupplier'].filter(({ id }) => id !== element.id);
    this.creditProposal.attributes['tradeCheckingSupplier'] = dataGrid;
    this.creditProposal.attributes['tradeCheckingSupplier'] = dataGrid;
    console.log('Tes Delete', dataGrid);
  }
}
