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
import { SurveyAppraisalsService } from '../survey-appraisals/survey-appraisals.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'jhi-survey-batch-create',
  templateUrl: './survey-batch-create.component.html',
  styleUrls: ['../credit-proposal/credit-proposal-list.css'],
})
export class SurveyBatchCreateComponent extends AbstractEntityMaterialComponent<ISurveyBatch> implements OnInit {
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

  // display column partner
  public displayedColumnsP: string[] = ['no', 'name', 'action'];
  public displayedColumnsExpandP = [...this.displayedColumnsP];

  clickedChip: { id: string; label: string };
  iconTimeline: any;
  activatedRoute: any;
  FormPartner: boolean;
  FormCollateral: boolean;
  // paginatorLengthP: number;
  // paginatorPageSizeP: number;
  constructor(
    private surveyAppraisalsService: SurveyAppraisalsService,
    protected messageService: MessageService,
    private surveyBatchService: SurveyBatchService,
    private collateralAppraisalService: CollateralAppraisalService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private partnerService: PartnerService,
    private applicationStateLogService: ApplicationStateLogService
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
  public itemsPartner: any;
  public arrayName = [] as any;
  public arrayCollateral = [] as any;

  public choosedPartner = [] as any;

  ngOnInit(): void {
    // this.activatedRoute.data.subscribe(({ surveyBatch }) => (this.surveyBatch = surveyBatch));
    //
    this.FormPartner = false;
    this.FormCollateral = true;
    this.loadAll();
    this.loadDataPartner();
  }

  private loadDataPartner(): void {
    this.partnerService
      // .query({
      .query({
        page: 0,
        size: 999,
      })
      .subscribe({
        next: (res: HttpResponse<ISurveyBatch[]>) => {
          console.log('res partner', res);
          this.initTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }
  private loadAll(): void {
    this.loading = true;

    this.surveyAppraisalsService
      .queryFilterBy({
        isSurveyBatch: false,
        page: this.page,
        size: this.itemsPerPage,
      })
      .subscribe({
        next: (res: HttpResponse<ISurveyBatch[]>) => {
          this.initTableFirst(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  selectPartner(data, check) {
    this.choosedPartner = [];
    this.choosedPartner.push(data.id);
    // if (check) {
    //   this.choosedPartner.push(data.id);
    // } else {
    //   for (let i = 0; i < this.choosedPartner.length; i++) {
    //     // const obj = this.choosedPartner[i];
    //     // console.log("obj",obj)
    //     if (this.choosedPartner[i] === data.id) {
    //       this.choosedPartner.splice(i, 1);
    //     }
    //   }
    // }
    console.log('this.choosedPartner', this.choosedPartner);
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

  protected postLoadDataLazy(): void {
    this.loadAll();
  }
  // ==============table partner=================
  initTable(data: any, headers: HttpHeaders): void {
    console.log('data', data);
    this.arrayName = [];
    for (let i = 0; i < data.body.length; i++) {
      if (data.body[i].surveyProvider === true) {
        this.arrayName.push(data.body[i]);
      }
    }
    console.log('arrayName', this.arrayName);
    this.itemsPartner = new MatTableDataSource(this.addIdx(this.arrayName));
    if (!this.itemsPartner) {
      this.itemsPartner.paginator = this.paginator;
    }
    this.itemsPartner.sort = this.sort;
    // console.log("headers",headers);
    // this.paginatorLengthP = parseInt(headers.get('X-Total-Count'), 10);
    // this.paginatorPageSizeP = this.paginator.pageSize;
    this.loading = false;
  }

  // loadDataLazyPartner(event?: PageEvent) {
  //   this.itemsPartner = null;
  //   this.page = event.pageIndex;
  //   this.itemsPerPage = event.pageSize;
  //   this.postLoadDataLazPartner();
  // }

  // protected postLoadDataLazPartner(): void {
  //   this.loadDataPartner();
  // }
  // ==============table partner=================
  nextStage(): void {
    console.log('this.choosedPartner', this.choosedPartner);
    if (this.choosedPartner.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Pilih Partner' });
    } else {
      this.FormPartner = true;
      this.FormCollateral = false;
    }
  }

  previousStateNew(): void {
    this.FormPartner = false;
    this.FormCollateral = true;
    // window.history.back();
  }

  previousState(): void {
    window.history.back();
  }

  create(): void {
    console.log('create btn');
    console.log('this.choosedPartner', this.choosedPartner);
    console.log('arrayCollateral', this.arrayCollateral);

    if (this.arrayCollateral.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Collateral tidak boleh kosong' });
      console.log('stop here ini collateral');
      return;
    }

    if (this.choosedPartner.length > 1) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Partner tidak boleh lebih dari 1' });
    } else {
      this.surveyBatchService
        .create({
          receivedDate: new Date(),
          surveyCompanyId: this.choosedPartner[0],
          attributes: {},
        })
        .subscribe(res => {
          console.log('res', res);
          let flag = 0;
          for (let i = 0; i < this.arrayCollateral.length; i++) {
            if (this.arrayCollateral[i].surveyBatchId !== null) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ada yg survey batchidnya tidak null' });
              // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ada yang survey batch idnya tidak null' })
              return;
            } else {
              // this.arrayCollateral[i].surveyBatchId = this.choosedPartner;
              this.arrayCollateral[i].surveyBatchId = res.body.id;
              this.collateralAppraisalService.update(this.arrayCollateral[i]).subscribe(result => {
                flag++;
                console.log('flag', flag);
                if (flag === this.arrayCollateral.length) {
                  this.router.navigate(['./batch-apprisal']);
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Save Success' });
                }
              });
            }
          }
        });
    }

    console.log('ini null semua', this.arrayCollateral);
  }
}
