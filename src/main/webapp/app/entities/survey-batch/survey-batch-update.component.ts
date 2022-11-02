import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { ISurveyBatch, SurveyBatch } from './survey-batch.model';
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
import { SurveyAppraisalsService } from '../survey-appraisals/survey-appraisals.service';

@Component({
  selector: 'jhi-survey-batch-update',
  templateUrl: './survey-batch-update.component.html',
})
export class SurveyBatchUpdateComponent extends AbstractEntityMaterialComponent<ISurveyBatch> implements OnInit {
  surveyBatch: ISurveyBatch | null = null;
  // display column colletral
  public displayedColumns: string[] = [
    'no',
    'appraisalNumber',
    'cif',
    'customerName',
    'customerType',
    'createdDate',
    'collateralType',
    'status',
    'action',
  ];
  public displayedColumnsExpand = [...this.displayedColumns];

  //display column partner
  public displayedColumnsP: string[] = ['no', 'name', 'action'];
  public displayedColumnsExpandP = [...this.displayedColumnsP];

  clickedChip: { id: string; label: string };
  iconTimeline: any;
  stateSubject: any;
  id: string;
  surveyCompanyId: any;
  constructor(
    private surveyAppraisalsService: SurveyAppraisalsService,
    protected messageService: MessageService,
    private surveyBatchService: SurveyBatchService,
    private collateralAppraisalService: CollateralAppraisalService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private partnerService: PartnerService,
    private applicationStateLogService: ApplicationStateLogService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(_snackBar, collateralAppraisalService);
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
  public arrayName = [] as any;
  public arrayCollateral = [] as any;

  ngOnInit(): void {
    // this.activatedRoute.data.subscribe(({ surveyBatch }) => (this.surveyBatch = surveyBatch));

    this.surveyCompanyId = this.activatedRoute.snapshot.data.content.surveyCompanyId;
    console.log('this.surveyCompanyId', this.surveyCompanyId);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('this.id', this.id);

    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true;

    this.surveyAppraisalsService
      .queryFilterBy({
        idSurveyBatch: this.id,
        page: 0,
        size: 999,
      })
      .subscribe({
        next: (res: HttpResponse<ISurveyBatch[]>) => {
          console.log('res', res);
          this.initTableFirst(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  previousState(): void {
    window.history.back();
  }

  checkedCollateral(data, event): void {
    console.log('check', data, event);
    if (event) {
      this.arrayCollateral.push(data);
    } else {
      for (let i = 0; i < this.arrayCollateral.length; i++) {
        const obj = data;
        if (this.arrayCollateral[i].id === obj.id) {
          this.arrayCollateral.splice(i, 1);
        }
      }
    }

    console.log('arrayCollateral', this.arrayCollateral);
  }

  initTableFirst(data: any, headers: HttpHeaders): void {
    for (let a = 0; a < data.body.length; a++) {
      if (data.body[a].surveyBatchId !== null) {
        console.log('ini yg tidak null', data.body[a]);
      } else {
        console.log('ini yg null', data.body[a].surveyBatchId);
      }
    }
    this.items = new MatTableDataSource(this.addIdx(data.body));
    if (!this.items) {
      this.items.paginator = this.paginator;
    }
    this.items.sort = this.sort;
    this.paginatorLength = parseInt(headers.get('X-Total-Count'), 10);
    this.paginatorPageSize = this.paginator.pageSize;
    this.loading = false;
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }
}
