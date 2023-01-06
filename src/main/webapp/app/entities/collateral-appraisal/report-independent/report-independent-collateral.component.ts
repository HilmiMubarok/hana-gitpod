import { Component, Input, OnInit } from '@angular/core';
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
import { STATUS } from 'app/shared/constants/status.constants';
import { ICollateralAppraisal } from '../collateral-appraisal.model';
import { ISurveyAppraisals } from 'app/entities/survey-appraisals/survey-appraisals.model';
// import { PositionService } from 'app/entities/position/position.service';

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
  @Input()
  public mData: IReportIndependent;
  formGroupPartner: FormGroup;
  formGroupPartnerOrganization: FormGroup;
  formGroupPartnerContact: FormGroup;

  moment = _rollupMoment || _moment;
  date = new FormControl(moment());
  public items: any;
  // public displayedColumns: string[] = ['no', 'fileName', 'SizeFile', 'typeFile', 'modifiedDate', 'modifiedBy', 'action'];
  // public displayedColumnsExpand = [...this.displayedColumns];

  post: any = '';
  organizationData: any = '';
  private id: string;
  public status: boolean;
  public reviewedOpinion: any;
  private _surveyAppraisal: ISurveyAppraisals;

  @Input()
  get surveyAppraisal() {
    return this._surveyAppraisal;
  }
  set surveyAppraisal(data: ISurveyAppraisals) {
    this._surveyAppraisal = data;
  }
  constructor(
    private collateralAppraisalService: CollateralAppraisalService,
    private formBuilder: FormBuilder,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    protected messageService: MessageService,
    public surveyBatchService: SurveyBatchService,
    protected activatedRoute: ActivatedRoute // private positionService: PositionService
  ) {
    super(_snackBar, surveyBatchService);
    this.page = 0;
    this.itemsPerPage = 10;
  }

  ngOnInit(): void {
    // console.log('cccc', this.collateralAppraisal.attributes['totalLuasBangunanFisik']);
    console.log('masuk report');
    this.getReport();

    // this.testReview();
    // this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // this.collateralAppraisalService.find(this.id).subscribe(result => {
    //   console.log('result', result);
    //   this.mData = result.body.attributes;
    //   this.mData.remark = result.body.remark;
    //   this.mData.marketValue = result.body.collateral.marketValue;
    //   this.mData.apprReportNum = result.body.apprReportNum;
    //   this.mData.apprDate = result.body.apprDate;
    //   this.mData.reportDate = result.body.reportDate;
    //   this.mData.reviewedBy = result.body.reviewedBy;
    // });
    // this.disabledAppraisalExternal();
  }

  public getReport() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.collateralAppraisalService.find(this.id).subscribe(result => {
      // this.data = result.body.reviewedOpinion
      this.mData = result.body.attributes;
      this.mData.appraisalNumber = result.body.appraisalNumber;
      this.mData.apprDate = result.body.apprDate;
      this.mData.reportDate = result.body.reportDate;
      this.mData.reviewedBy = result.body.reviewedBy;
      this.mData.marketValue = result.body.collateral.marketValue;
      this.mData.remark = result.body.remark;
      // this.reviewedOpinion = result.body.reviewedOpinion;

      if (result.body.apprOfficer === 'External') {
        if (result.body.statusId === STATUS.APPROVE) {
          this.status = true;
        } else {
          this.status = false;
        }
      }
    });
  }

  // public teamReviewName: any;
  // public testReview() {
  //   this.id = this.activatedRoute.snapshot.paramMap.get('id');
  //   this.collateralAppraisalService.find(this.id).subscribe(result => {
  //     this.positionService
  //       .queryFilterBy({
  //         page: 0,
  //         size: 9999,
  //         idInternal: result.body.teamLeadId,
  //         // surveyAppraisal.teamLeadId
  //       })
  //       .subscribe(res => {
  //         // const teamLeader = [];
  //         for (let i = 0; i < res.body.length; i++) {
  //           if (res.body[i].positionTypeDescription === 'Team Leader') {
  //              this.teamReviewName.push(res.body[i].employeeFirstName);
  //             console.log('xxxxx', res.body[i].employeeFirstName);
  //             // teamLeader.push({ employeeFirstName: res.body[i].employeeFirstName, id: res.body[i].id });
  //           }
  //              result.body.reviewedBy = this.teamReviewName;

  //           console.log('yyyy', res.body[i].employeeFirstName);
  //         }

  //         // this.teamReviewName = teamLeader;
  //       });
  //     // this.positionService.find(result.body.surveyorArea).subscribe(res => {
  //     //   this.teamReviewName = res.body.employeeFirstName;
  //     // });
  //   });
  // }
  previousState(): void {
    window.history.back();
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
  }
}
