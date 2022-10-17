import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../../credit-proposal.model';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { LoanApplicationService } from 'app/entities/loan-application/loan-application.service';
import { ITradeCheckingBuyers, TradeCheckingBuyers } from './trade-checking-buyers.model';
import { CreditProposalTradeCheckingBuyersDialogComponent } from './credit-proposal-trade-checking-buyers-dialog.component';
import { CreditProposalTradeCheckingBuyersDialogEditComponent } from './edit/credit-proposal-trade-checking-buyers-dialog-edit.component';

@Component({
  selector: 'jhi-trade-checking-buyers',
  templateUrl: './credit-proposal-trade-checking-buyers.component.html',
  styleUrls: ['../trade-checking.scss'],
})
export class CreditProposalTradeCheckingBuyersComponent implements OnChanges {
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
    'buyersName',
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

  // Tambah data And Detail data
  public openDialog(element: ITradeCheckingBuyers = null): void {
    const predicate = {
      width: '80vw',
      data: {
        object: this.creditProposal,
      },
    };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['tradeCheckingBuyers'] = element;
      predicate.data['view'] = true;
    } else {
      predicate.data['tradeCheckingBuyers'] = new TradeCheckingBuyers();
    }
    const dialogRef = this.dialog.open(CreditProposalTradeCheckingBuyersDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loanApplication.attributes['tradeCheckingBuyers'] = [...this.creditProposal.attributes['tradeCheckingBuyers'], res];
        this.creditProposal.attributes['tradeCheckingBuyers'] = [...this.creditProposal.attributes['tradeCheckingBuyers'], res];
      }
    });
  }

  // Edit
  public editDialog(element: ITradeCheckingBuyers = null): void {
    // Jika data kosong view true
    const predicate = { width: '80vw', data: {} };
    predicate.data['edit'] = true;
    // kondisi jika ada element
    if (element) {
      predicate.data['tradeCheckingBuyers'] = element;
      predicate.data['edit'] = true;
    } else {
      predicate.data['tradeCheckingBuyers'] = new TradeCheckingBuyers();
    }

    const dialogRef = this.dialog.open(CreditProposalTradeCheckingBuyersDialogEditComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      // find indexnya dari atributtes nya dan jika ketemu
      const buyersIndex: number = lodash.findIndex(
        this.creditProposal.attributes['tradeCheckingBuyers'],
        function (o: ITradeCheckingBuyers) {
          // mengembalikan objek yg di cari dan disamakan dengan yg ada di db attributes
          return o.id === res['tradeCheckingBuyers'].id;
        }
      );
      // jika indexnya lebih dari -1
      if (buyersIndex > -1) {
        // diganti dengan data yg  bru
        this.creditProposal.attributes['tradeCheckingBuyers'][buyersIndex] = res['tradeCheckingBuyers'];
      } else {
        this.creditProposal.attributes['tradeCheckingBuyers'] = [
          ...this.creditProposal.attributes['tradeCheckingBuyers'],
          res['tradeCheckingBuyers'],
        ];
      }
    });
  }

  // DELETE
  public onDelete(element: ICreditProposal) {
    const dataGrid = this.creditProposal.attributes['tradeCheckingBuyers'].filter(({ id }) => id !== element.id);
    this.creditProposal.attributes['tradeCheckingBuyers'] = dataGrid;
    this.creditProposal.attributes['tradeCheckingBuyers'] = dataGrid;
    console.log('Tes Delete', dataGrid);
  }
}
