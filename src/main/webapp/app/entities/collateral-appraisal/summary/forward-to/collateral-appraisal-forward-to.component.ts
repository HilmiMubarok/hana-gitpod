import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';
import { ISurveyAppraisals, SurveyAppraisals } from 'app/entities/survey-appraisals/survey-appraisals.model';
import { SurveyAppraisalsService } from 'app/entities/survey-appraisals/survey-appraisals.service';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { POSITION_TYPE } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';
@Component({
  selector: 'jhi-collateral-appraisal-forward-to',
  templateUrl: './collateral-appraisal-forward-to.component.html',
  styleUrls: ['../collateral-appraisal-summary.css'],
})
/* export class CollateralAppraisalSummaryComponent implements OnInit { */
export class CollateralAppraisalForwardToComponent implements OnInit {
  @Output() assignTo = new EventEmitter();
  @Input()
  collateralAppraisal: ICollateralAppraisal;
  private _surveyAppraisals: ISurveyAppraisals;
  public surveyAppraisalObj: ISurveyAppraisals[];

  public positionUH: IPosition[];
  public position: IPosition[];
  public positionDH: IPosition[];
  public positionTL: IPosition[];
  public positionDeptHead: IPosition[];

  public applicationRoleIdUH: number;
  public applicationRoleIdDH: number;
  public applicationRoleIdTL: number;
  public applicationRoleIdDeptHead: number;

  @Input()
  get surveyAppraisal() {
    return this._surveyAppraisals;
  }
  set surveyAppraisal(data: ISurveyAppraisals) {
    this._surveyAppraisals = data;
  }

  ngOnInit(): void {
    this.loadPosition(POSITION_TYPE.DH);
    this.loadPosition(POSITION_TYPE.UH);
    this.loadPosition(POSITION_TYPE.TL);
    this.loadPosition(POSITION_TYPE.DEPT_HEAD);
  }

  constructor(
    protected surveyAppraisalService: SurveyAppraisalsService,
    protected reportUtils: ReportUtilService,
    private positionService: PositionService
  ) {}

  public loadPosition(position): void {
    this.positionService.queryFilterBy({ idPositionType: position, size: 9999, page: 0 }).subscribe(res => {
      if (position === POSITION_TYPE.DH) {
        this.positionDH = lodash.filter(res.body, function (o) {
          return o.partyId !== null;
        });
      } else if (position === POSITION_TYPE.UH) {
        this.positionUH = lodash.filter(res.body, function (o) {
          return o.partyId !== null;
        });
      } else if (position === POSITION_TYPE.TL) {
        this.positionTL = lodash.filter(res.body, function (o) {
          return o.partyId !== null;
        });
      } else if (position === POSITION_TYPE.DEPT_HEAD) {
        this.positionDeptHead = lodash.filter(res.body, function (o) {
          return o.partyId !== null;
        });
      }

      this.surveyAppraisalService.find(this.surveyAppraisal.id).subscribe(resApplicationRole => {
        if (resApplicationRole) {
          this.surveyAppraisal = resApplicationRole.body;
          for (let i = 0; i < this.positionDH.length; i++) {
            if (this.surveyAppraisal.divHeadId === this.positionDH[i].employeeId) {
              this.applicationRoleIdDH = this.positionDH[i].employeeId;
            }
          }
          for (let i = 0; i < this.positionTL.length; i++) {
            if (this.surveyAppraisal.teamLeadId === this.positionTL[i].employeeId) {
              this.applicationRoleIdTL = this.positionTL[i].employeeId;
            }
          }
          for (let i = 0; i < this.positionUH.length; i++) {
            if (this.surveyAppraisal.unitHeadId === this.positionUH[i].employeeId) {
              this.applicationRoleIdUH = this.positionUH[i].employeeId;
            }
          }
          for (let i = 0; i < this.positionDeptHead.length; i++) {
            if (this.surveyAppraisal.deptHeadId === this.positionDeptHead[i].employeeId) {
              this.applicationRoleIdDeptHead = this.positionDeptHead[i].employeeId;
            }
          }
        }
      });
    });
  }

  public funcCheckDataPosition(position: any, id: number) {
    if (id !== undefined) {
      console.log('id data', id);
      let positionDH = [];
      let positionUH = [];
      let positionTL = [];
      let positionDeptHead = [];

      this.positionService.queryFilterBy({ idPositionType: position, size: 9999, page: 0 }).subscribe(res => {
        if (position === POSITION_TYPE.DH) {
          positionDH = lodash.filter(res.body, function (o) {
            return o.partyId !== null;
          });
        } else if (position === POSITION_TYPE.UH) {
          positionUH = lodash.filter(res.body, function (o) {
            return o.partyId !== null;
          });
        } else if (position === POSITION_TYPE.TL) {
          positionTL = lodash.filter(res.body, function (o) {
            return o.partyId !== null;
          });
        } else if (position === POSITION_TYPE.DEPT_HEAD) {
          positionDeptHead = lodash.filter(res.body, function (o) {
            return o.partyId !== null;
          });
        }

        this.surveyAppraisalService.find(id).subscribe(resApplicationRole => {
          if (resApplicationRole) {
            const surveyAppraisal = resApplicationRole.body;
            for (let i = 0; i < positionDH.length; i++) {
              if (positionDH[i].employeeId === surveyAppraisal.divHeadId) {
                this.surveyAppraisalService.applicationRoleIdDH = ['true'];
              }
            }
            for (let i = 0; i < positionTL.length; i++) {
              if (positionTL[i].employeeId === surveyAppraisal.teamLeadId) {
                this.surveyAppraisalService.applicationRoleIdTL = ['true'];
              }
            }
            for (let i = 0; i < positionUH.length; i++) {
              if (positionUH[i].employeeId === surveyAppraisal.unitHeadId) {
                this.surveyAppraisalService.applicationRoleIdUH = ['true'];
              }
            }
            for (let i = 0; i < positionDeptHead.length; i++) {
              if (positionDeptHead[i].employeeId === surveyAppraisal.deptHeadId) {
                this.surveyAppraisalService.applicationRoleIdDeptHead = ['true'];
              }
            }
          }
        });
      });
    }
  }

  public selectDH(event): void {
    for (let i = 0; i < this.positionDH.length; i++) {
      if (event.value === this.positionDH[i].employeeId) {
        this.surveyAppraisal.divHeadPersonId = this.positionDH[i].partyId;
        this.surveyAppraisal.divHeadName = this.positionDH[i].employeeFirstName;
        this.surveyAppraisal.divHeadId = this.positionDH[i].employeeId;
      }
    }
    for (let i = 0; i < this.positionUH.length; i++) {
      if (event.value === this.positionUH[i].employeeId) {
        this.surveyAppraisal.unitHeadPersonId = this.positionUH[i].partyId;
        this.surveyAppraisal.unitHeadName = this.positionUH[i].employeeFirstName;
        this.surveyAppraisal.unitHeadId = this.positionUH[i].employeeId;
      }
    }
    for (let i = 0; i < this.positionTL.length; i++) {
      if (event.value === this.positionTL[i].employeeId) {
        this.surveyAppraisal.teamLeadPersonId = this.positionTL[i].partyId;
        this.surveyAppraisal.teamLeadName = this.positionTL[i].employeeFirstName;
        this.surveyAppraisal.teamLeadId = this.positionTL[i].employeeId;
      }
    }
    for (let i = 0; i < this.positionDeptHead.length; i++) {
      if (event.value === this.positionDeptHead[i].employeeId) {
        this.surveyAppraisal.deptHeadPersonId = this.positionDeptHead[i].partyId;
        this.surveyAppraisal.deptHeadName = this.positionDeptHead[i].employeeFirstName;
        this.surveyAppraisal.deptHeadId = this.positionDeptHead[i].employeeId;
      }
    }
    this.assignTo.emit(this.surveyAppraisal);
  }
  gakbisa() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
  }
}
