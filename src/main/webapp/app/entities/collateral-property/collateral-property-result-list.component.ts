import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { CollateralAppraisalService } from '../collateral-appraisal/collateral-appraisal.service';
import { ICollateral } from '../collateral/collateral.model';
import { ICollateralProperty } from './collateral-property.model';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { SurveyBatchService } from '../survey-batch/survey-batch.service';
import { PartnerService } from '../partner/partner.service';
import { STATUS } from 'app/shared/constants/status.constants';

@Component({
  selector: 'jhi-collateral-property-result-list',
  templateUrl: './collateral-property-result-list.component.html',
  styleUrls: ['./collateral-property.style.scss'],
})
export class CollateralPropertyResultListComponent implements OnInit {
  public penampung: ICollateralAppraisal[];
  public dataSource: ICollateralAppraisal[];
  public collateral: ICollateral;
  public collateralAppraisal: ICollateralAppraisal;
  public displayColumns: string[] = [
    'no',
    'appraisalNumber',
    'appraisalDate',
    'appraisalValidityPeriod',
    'appraisalType',
    'institution',
    'marketValue',
    'liquidationValue',
    'action',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { collateral: ICollateral },
    private _dialog: MatDialogRef<CollateralPropertyResultListComponent>,
    private collateralApprraisalService: CollateralAppraisalService,
    protected reportUtils: ReportUtilService,
    private surveyBatchService: SurveyBatchService,
    private partnerService: PartnerService
  ) {
    this.collateral = this.data.collateral;
  }

  ngOnInit(): void {
    this.getDataResult();
  }

  getDataResult() {
    this.collateralApprraisalService
      .cashQueryFilterBy({ idCollateral: this.collateral.id, idStatus: STATUS.COMPLETE, size: 9999, page: 0, sort: ['desc'] })
      .subscribe(res => {
        // Pergantian Endpoint Dari BE PHASE 2
        if (res.body.length > 0) {
          this.dataSource = res.body;
          console.log('data source', this.dataSource);

          for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i].apprOfficer === 'External') {
              this.surveyBatchService.find(this.dataSource[i].surveyBatchId).subscribe(ress => {
                this.partnerService.find(ress.body.surveyCompanyId).subscribe(resss => {
                  this.dataSource[i].surveyCompanyName = resss.body.name;
                });
              });

              console.log('partner KJPP', this.dataSource[i].collateral.surveyCompanyName);
            }
          }
        } else {
          this.dataSource = [];
        }
      });
  }

  print(id: number, type: string) {
    if (type === 'word') {
      this.reportUtils.downloadFile2('/services/report/api/report/survey-appraisal/word-stream/' + id, '', 'Report_' + id);
    } else if (type === 'pdf') {
      this.reportUtils.downloadFile3('/services/report/api/report/survey-appraisal/pdf-word-stream/' + id, '', 'Report_' + id);
    }
  }

  public closeDialog() {
    this._dialog.close();
  }
}
