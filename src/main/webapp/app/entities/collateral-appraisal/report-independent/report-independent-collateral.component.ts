import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
// import { SurveyBatchService } from '../survey-batch.service';
// import { ISurveyBatch } from '../survey-batch.model';
import { SurveyAppraisalsService } from 'app/entities/survey-appraisals/survey-appraisals.service';
import { CollateralAppraisalService } from 'app/entities/collateral-appraisal/collateral-appraisal.service';
import { IReportIndependent } from './report-independent.model';
import { ISurveyBatch } from 'app/entities/survey-batch/survey-batch.model';
import { SurveyBatchService } from 'app/entities/survey-batch/survey-batch.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import moment from 'moment';
import { FormControl } from '@angular/forms';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY/MM/DD',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY/MM/DD',
  },
};
@Component({
  selector: 'jhi-report-independent-collateral',
  templateUrl: './report-independent-collateral.component.html',
  styleUrls: ['./report-independent.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ReportIndependentCollateralComponent extends AbstractEntityMaterialComponent<ISurveyBatch> implements OnInit {
  public mData: IReportIndependent;
  formGroupPartner: FormGroup;
  formGroupPartnerOrganization: FormGroup;
  formGroupPartnerContact: FormGroup;
  moment = _rollupMoment || _moment;
  date = new FormControl(moment());
  public items: any;
  public displayedColumns: string[] = ['no', 'fileName', 'SizeFile', 'typeFile', 'modifiedDate', 'modifiedBy', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns];

  post: any = '';
  organizationData: any = '';
  private id: string;
  constructor(
    private collateralAppraisalService: CollateralAppraisalService,
    private formBuilder: FormBuilder,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    protected messageService: MessageService,
    public surveyBatchService: SurveyBatchService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(_snackBar, surveyBatchService);
    this.page = 0;
    this.itemsPerPage = 10;
  }

  ngOnInit(): void {
    console.log('masuk report');
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.collateralAppraisalService.find(this.id).subscribe(result => {
      console.log('result', result);
      this.mData = result.body.attributes;
      this.mData.remark = result.body.remark;
      this.mData.marketValue = result.body.collateral.marketValue;
      this.mData.apprReportNum = result.body.apprReportNum;
      this.mData.apprDate = result.body.apprDate;
      this.mData.reportDate = result.body.reportDate;
      this.mData.reviewedBy = result.body.reviewedBy;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
