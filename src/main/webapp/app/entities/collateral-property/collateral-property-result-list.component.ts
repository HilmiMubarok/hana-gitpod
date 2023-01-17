import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { CollateralAppraisalService } from '../collateral-appraisal/collateral-appraisal.service';
import { ICollateral } from '../collateral/collateral.model';
import { ICollateralProperty } from './collateral-property.model';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { SurveyBatchService } from '../survey-batch/survey-batch.service';
import { PartnerService } from '../partner/partner.service';

@Component({
  selector: 'jhi-collateral-property-result-list',
  templateUrl: './collateral-property-result-list.component.html',
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
      .queryFilterBy({ idCollateral: this.collateral.id, size: 9999, page: 0, sort: ['desc'] })
      .subscribe(res => {
        this.penampung = res.body.filter(obj => obj.statusId === 'COMPLETE');
        if (this.penampung.length > 0) {
          this.dataSource = this.penampung;

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
      this.reportUtils.viewFile('/services/report/api/report/survey-appraisal/pdf-word-stream/' + id);
    }
  }

  public closeDialog() {
    this._dialog.close();
  }
}
