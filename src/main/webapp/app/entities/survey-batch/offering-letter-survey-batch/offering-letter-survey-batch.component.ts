import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { ISurveyBatch } from '../survey-batch.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

import { MatTableDataSource } from '@angular/material/table';
import { CollateralAppraisalService } from '../../collateral-appraisal/collateral-appraisal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStateLogService } from '../../application-state-log/application-state-log.service';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { SurveyBatchService } from '../survey-batch.service';
import { PartnerService } from '../../partner/partner.service';
import { OFFERING_LETTER_SURVEY_BATCH } from 'app/shared/constants/base.constants';
import { IOfferingLetter } from 'app/entities/offering-letter/offering-page/offering-page.model';
import { ISurveyRequest } from './survey-request.model';
import { SurveyRequestService } from './survey-request.service';
import { ReportUtilService } from 'app/shared/base/report-util.service';

@Component({
  selector: 'jhi-offering-letter-survey-batch',
  templateUrl: './offering-letter-survey-batch.component.html',
  styleUrls: ['../../credit-proposal/credit-proposal-list.css'],
})
export class OfferingLetterSurveyBatchComponent extends AbstractEntityMaterialComponent<ISurveyRequest> implements OnInit {
  public clickedMenu: string;
  offeringLetter: IOfferingLetter | null = null;
  public displayedColumns: string[] = ['no', 'tanggal', 'nomor', 'namaKjpp','biaya','action'];
  public displayedColumnsExpand = [...this.displayedColumns];
  clickedChip: { id: string; label: string };
  iconTimeline: any;
  activatedRoute: any;
  public subMenu: object[];
  constructor(
    private surveyRequestService: SurveyRequestService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    private partnerService: PartnerService,
    protected reportUtils: ReportUtilService
  ) {
    super(_snackBar, surveyRequestService);
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

    this.surveyRequestService
      // .query({
      .queryNew({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe({
        next: (res: HttpResponse<ISurveyRequest[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  previousState(): void {
    window.history.back();
  }

  public routeSubMenu(menu: object): void {
    // this.router.navigate([this.router.url], { queryParams: { subroute: menu['id'] } });
    this.router.navigate(['./batch-apprisal/' + menu['id']]);
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public downloadOffering(id): void {
    this.reportUtils.downloadFile('/services/report/api/report/generate-penawaran/' + id);
  }

  public downloadSpk(id): void {
    this.reportUtils.downloadFile('/services/report/api/report/generate-spk/' + id);
  }
}
