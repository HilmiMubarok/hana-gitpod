import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CashSurveyAppraisalsService } from 'app/entities/survey-appraisals/cash-survey-appraisal.service';
import { ISurveyAppraisals } from 'app/entities/survey-appraisals/survey-appraisals.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'jhi-correction-appraisal',
  templateUrl: './correction-appraisal.component.html',
})
export class CorrectionAppraisalComponent extends AbstractEntityMaterialComponent<ISurveyAppraisals> implements OnInit {
  public displayColumns: string[] = ['no', 'appraisalNumber', 'cif', 'customerName', 'status', 'action'];
  public currentSearch: string;

  constructor(
    private cashSurveyAppraisalsService: CashSurveyAppraisalsService,
    protected _snackbar: MatSnackBar,
    private clipboard: Clipboard
  ) {
    super(_snackbar, cashSurveyAppraisalsService);
    this.currentSearch = '';
    this.page = 0;
    this.itemsPerPage = 10;
    this.loading = true;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }

  ngOnInit(): void {
    this.loadAll(this.currentSearch);
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

  public loadAll(text: string = null): void {
    this.cashSurveyAppraisalsService
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

  public copy(text: string): void {
    this.clipboard.copy(text);
    this._snackBar.open('copy ' + text + ' successfully to your clipboard', null, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 1000,
    });
  }
}
