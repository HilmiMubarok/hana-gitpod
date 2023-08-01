import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CashCreditProposalService } from 'app/entities/credit-proposal/cash-credit-proposal.service';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'jhi-correction-application',
  templateUrl: './correction-application.component.html',
  styleUrls: ['./correction-application.scss'],
})
export class CorrectionApplicationComponent extends AbstractEntityMaterialComponent<ILoanApplication> implements OnInit {
  public displayColumns: string[] = ['no', 'applicationNumber', 'cif', 'customerName', 'status', 'action'];
  public currentSearch: string;
  constructor(
    private cashCreditProposalService: CashCreditProposalService,
    protected _snackbar: MatSnackBar,
    private clipboard: Clipboard
  ) {
    super(_snackbar, cashCreditProposalService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.loading = true;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.currentSearch = '';
  }

  ngOnInit(): void {
    this.loadAll(this.currentSearch);
  }

  public loadAll(text: string = null): void {
    this.cashCreditProposalService
      .getIncorrectData({
        page: this.page,
        size: this.itemsPerPage,
        query: text,
        sort: this.sortData(),
      })
      .subscribe(res => {
        this.initDataForMatTable(res, res.headers);
      });
  }

  protected postLoadDataLazy(): void {
    this.loading = true;
    this.loadAll(this.currentSearch);
  }

  public search(): void {
    this.items = null;
    this.loading = true;
    this.loadAll(this.currentSearch);
  }

  public clear(): void {
    this.items = null;
    this.loading = true;
    this.currentSearch = '';
    this.loadAll(this.currentSearch);
  }

  public copy(text: string): void {
    this.clipboard.copy(text);
    this._snackBar.open('copy ' + text + ' successfully to your clipboard', null, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 1000,
    });
  }
}
