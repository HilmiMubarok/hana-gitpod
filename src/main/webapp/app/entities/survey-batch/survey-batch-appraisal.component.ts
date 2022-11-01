import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { ISurveyBatch } from './survey-batch.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

import { MatTableDataSource } from '@angular/material/table';
import { CollateralAppraisalService } from '../collateral-appraisal/collateral-appraisal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { SurveyBatchService } from './survey-batch.service';

@Component({
  selector: 'jhi-survey-batch-appraisal',
  templateUrl: './survey-batch-appraisal.component.html',
})
export class SurveyBatchAppraisalComponent extends AbstractEntityMaterialComponent<ISurveyBatch> implements OnInit {
  surveyBatch: ISurveyBatch | null = null;
  public displayedColumns: string[] = ['no', 'collateralTypeDescription', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  clickedChip: { id: string; label: string };
  iconTimeline: any;
  activatedRoute: any;
  constructor(
    private surveyBatchService: SurveyBatchService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService
  ) {
    super(_snackBar, surveyBatchService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
    this.clickedChip = {
      id: '',
      label: '',
    };
    this.iconTimeline = faTimeline;
  }
  public items: any;

  ngOnInit(): void {
    // this.activatedRoute.data.subscribe(({ surveyBatch }) => (this.surveyBatch = surveyBatch));

    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true;
    // if (this.clickedChip['id'] !== '') {
    //   this.surveyBatchService
    //     .queryFilterBy({
    //       page: this.page,
    //       idStatus: this.clickedChip['id'],
    //       size: this.itemsPerPage,
    //       sort: this.sortData(),
    //     })
    //     .pipe(map((res: HttpResponse<ISurveyBatch[]>) => this.preLoad(res)))
    //     .subscribe({
    //       next: (res: HttpResponse<ISurveyBatch[]>) => this.initDataForMatTable(res, res.headers),
    //       error: (res: HttpErrorResponse) => this.onError(res.message),
    //     });
    //   return;
    // }

    // if (this.currentSearch && this.currentSearch !== '') {
    //   this.surveyBatchService
    //     .search({
    //       page: this.page - 1,
    //       query: this.currentSearch,
    //       size: this.itemsPerPage,
    //       sort: this.sortData(),
    //     })
    //     .pipe(map((res: HttpResponse<ISurveyBatch[]>) => this.preLoad(res)))
    //     .subscribe({
    //       next: (res: HttpResponse<ISurveyBatch[]>) => {
    //         this.initDataForMatTable(res, res.headers);
    //       },
    //       error: (res: HttpErrorResponse) => this.onError(res.message),
    //     });
    //   return;
    // }

    this.surveyBatchService
      // .query({
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe({
        next: (res: HttpResponse<ISurveyBatch[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  previousState(): void {
    window.history.back();
  }
}
