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
import { PartnerService } from '../partner/partner.service';
import { OFFERING_LETTER_SURVEY_BATCH } from 'app/shared/constants/base.constants';

@Component({
  selector: 'jhi-survey-batch-appraisal',
  templateUrl: './survey-batch-appraisal.component.html',
  styleUrls: ['../credit-proposal/credit-proposal-list.css'],
})
export class SurveyBatchAppraisalComponent extends AbstractEntityMaterialComponent<ISurveyBatch> implements OnInit {
  public clickedMenu: string;
  surveyBatch: ISurveyBatch | null = null;
  public displayedColumns: string[] = ['no', 'name', 'receivedDate', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns];
  clickedChip: { id: string; label: string };
  iconTimeline: any;
  activatedRoute: any;
  public subMenu: object[];
  constructor(
    private surveyBatchService: SurveyBatchService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    private partnerService: PartnerService
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
    this.subMenu = OFFERING_LETTER_SURVEY_BATCH;
    console.log("menu", this.subMenu);
    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true;

    this.surveyBatchService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id,desc'],
      })
      .subscribe({
        next: (res: HttpResponse<ISurveyBatch[]>) => {
          this.partnerService
            .query({
              page: 0,
              size: 999,
            })
            .subscribe({
              next: (response: HttpResponse<ISurveyBatch[]>) => {
                console.log('res partner', response.body);
                for (let a = 0; a < res.body.length; a++) {
                  for (let b = 0; b < response.body.length; b++) {
                    if (res.body[a].surveyCompanyId === response.body[b].id) {
                      res.body[a].name = response.body[b].name;
                    }
                  }
                }
                console.log('res for table', res.body);
                this.initDataForMatTable(res, res.headers);
              },
              error: (response: HttpErrorResponse) => this.onError(response.message),
            });
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  previousState(): void {
    window.history.back();
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }
}
