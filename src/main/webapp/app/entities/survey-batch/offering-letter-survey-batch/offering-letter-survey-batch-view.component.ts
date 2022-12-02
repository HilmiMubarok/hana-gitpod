import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
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
import { ISurveyRequest, SurveyRequest } from './survey-request.model';
import { SurveyRequestService } from './survey-request.service';
import { SurveyAppraisalsService } from 'app/entities/survey-appraisals/survey-appraisals.service';
import { PageEvent } from '@angular/material/paginator';
import lodash from 'lodash';

@Component({
  selector: 'jhi-offering-letter-survey-batch-view',
  templateUrl: './offering-letter-survey-batch-view.component.html',
  styleUrls: ['../../credit-proposal/credit-proposal-list.css'],
})
export class OfferingLetterSurveyBatchViewComponent extends AbstractEntityMaterialComponent<ISurveyRequest> implements OnInit {
  public clickedMenu: string;
  offeringLetter: IOfferingLetter | null = null;
  private id: string;

  public displayedColumns: string[] = [
    'no',
    'appraisalNumber',
    'cif',
    'customerName',
    'customerType',
    'createdDate',
    'collateralType',
    'status',
    // 'action',
  ];
  public displayedColumnsExpand = [...this.displayedColumns];

  public displayedColumnsP: string[] = ['no', 'name', 'roleId', 'action'];
  public displayedColumnsExpandP = [...this.displayedColumnsP];

  clickedChip: { id: string; label: string };
  iconTimeline: any;
  public subMenu: object[];


  FormPartner: boolean;
  FormCollateral: boolean;

  paginatorLengthP: number;
  paginatorPageSizeP: number;

  public biayaAppraisal: number;

  public surveyRequest: ISurveyRequest;

  constructor(
    private surveyAppraisalsService: SurveyAppraisalsService,
    private surveyRequestService: SurveyRequestService,
    protected messageService: MessageService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    protected activatedRoute: ActivatedRoute,
    private applicationStateLogService: ApplicationStateLogService,
    private partnerService: PartnerService
  ) {
    super(_snackBar, surveyRequestService);
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
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
  public choosedPartner = [] as any;

  ngOnInit(): void {
    this.FormPartner = true;
    this.FormCollateral = false;
    this.loadById();
    this.loadDataPartner();
    this.surveyRequest = new SurveyRequest();

  }

  private loadById(): void {
    this.surveyRequestService.getAggregate(this.id)
    .subscribe(res => {
      this.surveyRequest = res.body;

      for (let y=0;y < this.surveyRequest.collateralAppraisalIds.length; y++) {
        this.surveyAppraisalsService.find(this.surveyRequest.collateralAppraisalIds[y]).subscribe(res2 => {
          console.log("res",y, res2.body);

          this.items = lodash.concat(this.items, res2.body);
          const removeundefined = lodash.remove(this.items,function(n) {
            return n === undefined;
          })
          console.log("items", this.items);
        });
      }
    });
  }

  // private loadAll(): void {
  //   this.loading = true;

  //   this.surveyAppraisalsService
  //     .queryFilterBy({
  //       idStatus: 'ASSIGNMENT',
  //       apprOfficer: 'External',
  //       page: this.page,
  //       size: this.itemsPerPage,
  //     })
  //     .subscribe({
  //       next: (res: HttpResponse<ISurveyBatch[]>) => {
  //         this.initTableFirst(res, res.headers);
  //       },
  //       error: (res: HttpErrorResponse) => this.onError(res.message),
  //     });
  // }

  private loadDataPartner(): void {
    this.partnerService
      // .query({
      .query({
        page: 0,
        size: 999,
      })
      .subscribe({
        next: (res: HttpResponse<ISurveyBatch[]>) => {
          this.initTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  previousState(): void {
    window.history.back();
  }

  previousStateNew(): void {
    this.FormPartner = false;
    this.FormCollateral = true;
    // window.history.back();
  }

  checkedCollateral(data, event): void {
    // if (event) {
    //   this.arrayCollateral.push(data);
    // } else {
    //   for (let i = 0; i < this.arrayCollateral.length; i++) {
    //     const obj = data;
    //     if (this.arrayCollateral[i].id === obj.id) {
    //       this.arrayCollateral.splice(i, 1);
    //     }
    //   }
    // }

    if (event) {
      this.arrayCollateral.push(data.id);
    }
  }

  selectPartner(data, check) {
    this.choosedPartner = data;
  }

  nextStage(): void {
    // if (this.choosedPartner.length === 0) {
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Pilih Collateral Appraisal' });
    // } else {
      this.FormPartner = true;
      this.FormCollateral = false;
    // }
  }

  create(): void {
    // this.surveyRequest.surveyCompany = this.choosedPartner;
    // this.surveyRequest.appraisalId = this.arrayCollateral;
    this.surveyRequest.cost = this.biayaAppraisal;
    this.surveyRequest.collateralAppraisalIds = this.arrayCollateral;
    this.surveyRequest.surveyCompanyId = this.choosedPartner.id;
    this.surveyRequest.surveyCompanyOrgId = this.choosedPartner.organization.id;
    this.surveyRequest.surveyCompanyName = this.choosedPartner.name;
    this.surveyRequest.description = '';
    this.surveyRequest.requestDate = new Date();

    this.surveyRequestService.createAggregate(this.surveyRequest).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Save Success',
      });

      if (res.body) {
        this.router.navigate(['/batch-apprisal']);
      }
    });
  }

  initTableFirst(data: any, headers: HttpHeaders): void {
    for (let i = 0; i < data.body.length; i++) {
      for (let j = 0; j < this.arrayCollateral.length; j++) {
        if (data.body[i].id === this.arrayCollateral[j].id) {
          data.body[i].checked = true;
        }
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

  // ==============table partner=================
  initTable(data: any, headers: HttpHeaders): void {
    this.arrayName = [];
    for (let i = 0; i < data.body.length; i++) {
      if (data.body[i].surveyProvider === true) {
        this.arrayName.push(data.body[i]);
      }
    }
    this.itemsPartner = new MatTableDataSource(this.addIdx(this.arrayName));
    if (!this.itemsPartner) {
      this.itemsPartner.paginator = this.paginator;
    }
    this.itemsPartner.sort = this.sort;
    this.paginatorLengthP = parseInt(headers.get('X-Total-Count'), 10);
    this.paginatorPageSizeP = this.paginator.pageSize;
    this.loading = false;
  }

  public routeSubMenu(menu: object): void {
    // this.router.navigate([this.router.url], { queryParams: { subroute: menu['id'] } });
    this.router.navigate(['./batch-apprisal/' + menu['id']]);
  }

  loadDataLazyPartner(event?: PageEvent) {
    this.itemsPartner = null;
    this.page = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.postLoadDataLazPartner();
  }

  protected postLoadDataLazPartner(): void {
    this.loadDataPartner();
  }

  protected postLoadDataLazy(): void {
    // this.loadAll();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.items.filter = filterValue;
  }
}
