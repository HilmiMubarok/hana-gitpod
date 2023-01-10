import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
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
import { GEO_BOUNDARY_TYPE, OFFERING_LETTER_SURVEY_BATCH } from 'app/shared/constants/base.constants';
import { SurveyAppraisalsService } from '../survey-appraisals/survey-appraisals.service';
import { ISurveyAppraisals } from '../survey-appraisals/survey-appraisals.model';
import { IStateBoundary } from '../state-boundary/state-boundary.model';
import { StateBoundaryService } from '../state-boundary/state-boundary.service';

@Component({
  selector: 'jhi-survey-batch-appraisal',
  templateUrl: './survey-batch-appraisal.component.html',
  styleUrls: ['../credit-proposal/credit-proposal-list.css'],
})
export class SurveyBatchAppraisalComponent extends AbstractEntityMaterialComponent<ISurveyBatch> implements OnInit {
  public clickedMenu: string;
  public globalSearchValModel: string;
  public globalSearchVal: string;
  cif: string;
  surveyBatch: ISurveyBatch | null = null;
  public displayedColumns: string[] = ['no', 'name', 'receivedDate', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns];
  clickedChip: { id: string; label: string };
  iconTimeline: any;
  public subMenu: object[];
  surveyCompanyId: any;
  constructor(
    private surveyBatchService: SurveyBatchService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    private partnerService: PartnerService,
    private surveyAppraisalService: SurveyAppraisalsService,
    protected stateBoundaryService: StateBoundaryService
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
    this.globalSearchValModel = '';
  }
  public items: any;
  public filterData: {
    [key: string]: Object;
  }[] = [];

  ngOnInit(): void {
    // this.activatedRoute.data.subscribe(({ surveyBatch }) => (this.surveyBatch = surveyBatch));
    this.subMenu = OFFERING_LETTER_SURVEY_BATCH;
    console.log('menu', this.subMenu);
    this.loadAll();
    this.loadCity();
  }
  public doSearch() {
    this.loadAll();
  }
  public onSelectTown(): void {
    this.currentSearch = null;
    this.doSearch();
  }
  private loadAll(): void {
    this.loading = true;
    if (this.globalSearchVal) {
      this.surveyAppraisalService
        .searchNew(
          {
            page: this.page,
            query: this.globalSearchVal,
            size: this.itemsPerPage,
            sort: ['id,desc'],
          },
          'External'
        )
        .subscribe({
          next: (res: HttpResponse<ISurveyAppraisals[]>) => this.initDataForMatTableCustom(res, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }
    if (this.currentSearch && this.currentSearch !== '') {
      this.surveyBatchService
        .queryFilterBy({
          // idSurveyBatch: this.id,
          cif: this.currentSearch,
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
                  for (let a = 0; a < res.body.length; a++) {
                    for (let b = 0; b < response.body.length; b++) {
                      if (res.body[a].surveyCompanyId === response.body[b].id) {
                        res.body[a].name = response.body[b].name;
                      }
                    }
                  }
                  this.initDataForMatTable(res, res.headers);
                },
                error: (response: HttpErrorResponse) => this.onError(response.message),
              });
          },
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
    }
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
                for (let a = 0; a < res.body.length; a++) {
                  for (let b = 0; b < response.body.length; b++) {
                    if (res.body[a].surveyCompanyId === response.body[b].id) {
                      res.body[a].name = response.body[b].name;
                    }
                  }
                }
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
  private initDataForMatTableCustom(data: any, headers: HttpHeaders) {
    let customItem = [];
    customItem = this.addIdx(data.body);
    customItem = this.addCustomItem(customItem);
    this.items = new MatTableDataSource(customItem);
    if (!this.items) {
      this.items.paginator = this.paginator;
    }
    this.items.sort = this.sort;
    this.paginatorLength = parseInt(headers.get('X-Total-Count'), 10);
    this.paginatorPageSize = this.paginator.pageSize;
    this.loading = false;
  }

  private addCustomItem(data: ISurveyAppraisals[]) {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].collateral === null) {
          const defaultCollateralNull = {
            collateralTypeDescription: '',
            collateralAddress: {
              address1: '',
            },
            collateralCityName: '',
          };
          data[i].collateral = defaultCollateralNull;
        }
      }
    }
    return data;
  }
  private loadCity(): void {
    this.stateBoundaryService
      .queryFilterBy({
        idBoundaryType: GEO_BOUNDARY_TYPE['city'],
        size: 9999,
      })
      .subscribe((res: HttpResponse<IStateBoundary[]>) => {
        let town;
        for (let i = 0; i < res.body.length; i++) {
          town = {};
          town = {
            id: res.body[i].id,
            description: res.body[i].description,
          };
          this.filterData.push(town);
        }
      });
  }
  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public routeSubMenu(menu: object): void {
    // this.router.navigate([this.router.url], { queryParams: { subroute: menu['id'] } });
    this.router.navigate(['./batch-apprisal/' + menu['id']]);
  }
}
