import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { SurveyBatchService } from '../survey-batch.service';
import { ISurveyBatch } from '../survey-batch.model';
import { CollateralAppraisalService } from 'app/entities/collateral-appraisal/collateral-appraisal.service';
import { IReportIndependent, ReportIndependent } from './report-independent.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import moment from 'moment';
import { FormControl } from '@angular/forms';
import { STATUS } from 'app/shared/constants/status.constants';
import { IPosition } from '@syncfusion/ej2-angular-grids';
import { ICollateralProperty, CollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { ISurveyAppraisals } from 'app/entities/survey-appraisals/survey-appraisals.model';

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
  selector: 'jhi-report-independent',
  templateUrl: './report-independent.component.html',
  styleUrls: ['./report-independent.css'],

  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ReportIndependentComponent extends AbstractEntityMaterialComponent<ISurveyBatch> implements OnInit {
  public mData: IReportIndependent;
  formGroupPartner: FormGroup;
  formGroupPartnerOrganization: FormGroup;
  formGroupPartnerContact: FormGroup;
  // moment = _rollupMoment || _moment;
  apprDate = new FormControl(moment().toDate());
  reportDate = new FormControl(moment().toDate());
  public items: any;
  public displayedColumns: string[] = ['no', 'fileName', 'SizeFile', 'typeFile', 'modifiedDate', 'modifiedBy', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns];

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
    protected activatedRoute: ActivatedRoute
  ) {
    super(_snackBar, surveyBatchService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.mData = new ReportIndependent();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  public position: IPosition[];

  ngOnInit(): void {
    this.getReport();
  }
  public getReport(): IReportIndependent {
    this.collateralAppraisalService.find(this.id).subscribe(result => {
      this.mData.tujuanPenilaian = result.body.attributes['tujuanPenilaian'];
      this.mData.appraisalNumber = result.body.appraisalNumber;
      this.mData.apprDate = result.body.apprDate;
      this.mData.reportDate = result.body.reportDate;
      this.mData.reviewedBy = result.body.reviewedBy;
      this.mData.remark = result.body.remark;
      this.reviewedOpinion = result.body.reviewedOpinion;
      this.mData.kjppNo = result.body.kjppNo;

      if (result.body.collateral.collateralTypeId === 'REALESTATE') {
        this.mData.totalLuasLandFisik =
          result.body.attributes['totalLuasTanahFisik'] !== null ? result.body.attributes['totalLuasTanahFisik'] : 0;
        this.mData.appraisalValueLandPerMeter =
          result.body.attributes['appraisalValueLandPerMeter'] !== null ? result.body.attributes['appraisalValueLandPerMeter'] : 0;
        this.mData.totalAppraisalValueLandFisik = this.mData.totalLuasLandFisik * this.mData.appraisalValueLandPerMeter;

        // Liquidation
        this.mData.appraisalLiquidationLand =
          result.body.attributes['appraisalLiquidationLand'] !== null ? result.body.attributes['appraisalLiquidationLand'] : 0;

        // Imb
        this.mData.totalLuasLandImb =
          result.body.attributes['totalLuasTanahIMB'] !== null ? result.body.attributes['totalLuasTanahIMB'] : 0;
        this.mData.appraisalValueImbLandPerMeter =
          result.body.attributes['appraisalValueImbTataKotaBuilding'] !== null
            ? result.body.attributes['appraisalValueImbTataKotaBuilding']
            : 0;
        this.mData.totalAppraisalValueLandImb = this.mData.totalLuasLandImb * this.mData.appraisalValueImbLandPerMeter;

        // TataKota
        this.mData.totalLuasLandTataKota =
          result.body.attributes['totalLuasTanahTataKota'] !== null ? result.body.attributes['totalLuasTanahTataKota'] : 0;
        this.mData.appraisalValueTataKotaLandPerMeter =
          result.body.attributes['appraisalValueTataKotaPerMeterLand'] !== null
            ? result.body.attributes['appraisalValueTataKotaPerMeterLand']
            : 0;
        this.mData.totalAppraisalValueLandTataKota = this.mData.totalLuasLandTataKota * this.mData.appraisalValueTataKotaLandPerMeter;
        // ================================================================================

        // Bangunan
        // Fisik
        this.mData.totalLuasBuildingFisik =
          result.body.attributes['totalLuasBangunanFisik'] !== null ? result.body.attributes['totalLuasBangunanFisik'] : 0;
        this.mData.appraisalValueBuildingPerMeter =
          result.body.attributes['appraisalValueBuildingPerMeter'] !== null ? result.body.attributes['appraisalValueBuildingPerMeter'] : 0;
        this.mData.totalAppraisalValueBuildingFisik = this.mData.totalLuasBuildingFisik * this.mData.appraisalValueBuildingPerMeter;

        // Liquidation
        this.mData.appraisalLiquidationBuilding =
          result.body.attributes['appraisalLiquidationBuilding'] !== null ? result.body.attributes['appraisalLiquidationBuilding'] : 0;
        // Imb
        this.mData.totalLuasBuildingImb =
          result.body.attributes['totalLuasBangunanIMB'] !== null ? result.body.attributes['totalLuasBangunanIMB'] : 0;
        this.mData.appraisalValueImbBuildingPerMeter =
          result.body.attributes['appraisalValueBuildingPerMeter'] !== null ? result.body.attributes['appraisalValueBuildingPerMeter'] : 0;
        this.mData.totalAppraisalValueBuildingImb = this.mData.totalLuasBuildingImb * this.mData.appraisalValueImbBuildingPerMeter;

        // TataKota
        this.mData.totalLuasBuildingTataKota =
          result.body.attributes['totalLuasBangunanTataKota'] !== null ? result.body.attributes['totalLuasBangunanTataKota'] : 0;
        this.mData.appraisalValueTataKotaBuildingPerMeter =
          result.body.attributes['appraisalValueTataKotaPerMeterBuilding'] !== null
            ? result.body.attributes['appraisalValueTataKotaPerMeterBuilding']
            : 0;
        this.mData.totalAppraisalValueBuildingTataKota =
          this.mData.totalLuasBuildingTataKota * this.mData.appraisalValueTataKotaBuildingPerMeter;

        // Total MV
        this.mData.totalMarketValueLandBuilding = this.mData.totalAppraisalValueLandFisik + this.mData.totalAppraisalValueBuildingFisik;
        this.mData.totalMarketValueImbLandBuilding = this.mData.totalAppraisalValueLandImb + this.mData.totalAppraisalValueBuildingImb;
        this.mData.totalLiquidationValueLandBuilding =
          parseFloat(result.body.attributes['appraisalLiquidationLand']) +
          parseFloat(result.body.attributes['appraisalLiquidationBuilding']);

        this.mData.totalMarketValueTataKotaLandBuilding =
          this.mData.totalAppraisalValueLandTataKota + this.mData.totalAppraisalValueBuildingTataKota;
        this.mData.quantity = result.body.attributes['quantity'];
      } else {
        this.mData.quantity = result.body.attributes['quantity'];
        this.mData.totalMVMachineVehicle = result.body.totalMarketValue;
        this.mData.totalLVMachineVehicle = result.body.totalLiquidationValue;
      }

      if (result.body.apprOfficer === 'External') {
        if (result.body.statusId === STATUS.APPROVAL_TL) {
          this.status = false;
        } else {
          this.status = true;
        }
      }
    });
    return this.mData;
  }

  // public teamReviewName: string;
  // public testReview() {
  //   this.id = this.activatedRoute.snapshot.paramMap.get('id');
  //   this.collateralAppraisalService.find(this.id).subscribe(result => {
  //     this.positionService.find(result.body.surveyorArea).subscribe(res => {
  //       this.teamReviewName = res.body.employeeFirstName;
  //     });
  //     console.log('ini reviewer KJPP', this.teamReviewName);
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
