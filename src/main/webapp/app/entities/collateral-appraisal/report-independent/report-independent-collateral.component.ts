import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CollateralAppraisalService } from 'app/entities/collateral-appraisal/collateral-appraisal.service';
import { IReportIndependent, ReportIndependent } from './report-independent.model';
import { ISurveyBatch } from 'app/entities/survey-batch/survey-batch.model';
import { SurveyBatchService } from 'app/entities/survey-batch/survey-batch.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import moment from 'moment';
import { FormControl } from '@angular/forms';
import { STATUS } from 'app/shared/constants/status.constants';
import { ISurveyAppraisals } from 'app/entities/survey-appraisals/survey-appraisals.model';
import { CollateralProperty, ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';

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

  apprDate = new FormControl(moment().toDate());
  reportDate = new FormControl(moment().toDate());
  date = new FormControl(moment());
  public items: any;

  post: any = '';
  organizationData: any = '';
  private id: string;
  public status: boolean;
  public reviewedOpinion: any;
  private _surveyAppraisal: ISurveyAppraisals;
  private _collateralProperty: ICollateralProperty;

  @Input()
  get collateralProp() {
    return this._collateralProperty;
  }
  set collateralProp(data: ICollateralProperty) {
    this._collateralProperty = data;
  }

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
    this.collateralProp = new CollateralProperty();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

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

      // Tanah
      // Fisik
      // this.mData.totalLuasLandFisik = result.body.attributes['totalLuasTanahFisik'];
      this.mData.totalLuasLandFisik =
        result.body.attributes['totalLuasTanahFisik'] !== null ? result.body.attributes['totalLuasTanahFisik'] : 0;
      this.mData.appraisalValueLandPerMeter =
        result.body.attributes['appraisalValueLandPerMeter'] !== null ? result.body.attributes['appraisalValueLandPerMeter'] : 0;
      this.mData.totalAppraisalValueLandFisik = this.mData.totalLuasLandFisik * this.mData.appraisalValueLandPerMeter;

      // Liquidation
      this.mData.appraisalLiquidationLand =
        result.body.attributes['appraisalLiquidationLand'] !== null ? result.body.attributes['appraisalLiquidationLand'] : 0;

      // Imb
      this.mData.totalLuasLandImb = result.body.attributes['totalLuasTanahIMB'] !== null ? result.body.attributes['totalLuasTanahIMB'] : 0;
      this.mData.appraisalValueImbLandPerMeter =
        result.body.attributes['appraisalValueIMBPerMeterLand'] !== null ? result.body.attributes['appraisalValueIMBPerMeterLand'] : 0;
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
        parseFloat(result.body.attributes['appraisalLiquidationLand']) + parseFloat(result.body.attributes['appraisalLiquidationBuilding']);

      this.mData.totalMarketValueTataKotaLandBuilding =
        this.mData.totalAppraisalValueLandTataKota + this.mData.totalAppraisalValueBuildingTataKota;

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

  previousState(): void {
    window.history.back();
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
  }
}
