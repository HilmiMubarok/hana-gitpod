import { Component, ChangeDetectorRef, OnChanges, SimpleChanges, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChangeEventArgs } from '@syncfusion/ej2-angular-layouts';
import { AccountService } from 'app/core/auth/account.service';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { IPartyCif, PartyCif } from 'app/entities/party-cif/party-cif.model';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { ISurveyAppraisals, SurveyAppraisals } from 'app/entities/survey-appraisals/survey-appraisals.model';
import { ISurveyor } from 'app/entities/surveyor/surveyor.model';
import { SurveyorService } from 'app/entities/surveyor/surveyor.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IPosition, Position } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';
import { APPLICATION_TYPE, POSITION_TYPE } from 'app/shared/constants/base.constants';
import { ILoanApplication } from 'app/entities/loan-application/loan-application.model';
import lodash from 'lodash';
import { ITimeline } from 'app/layouts/miscellaneous/timeline.model';
import { ICollateralAppraisal } from '../collateral-appraisal.model';
import { Account } from 'app/core/auth/account.model';
import { SurveyBatchService } from 'app/entities/survey-batch/survey-batch.service';
import { PartnerService } from 'app/entities/partner/partner.service';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ApplicationStateLogService } from 'app/entities/application-state-log/application-state-log.service';
import { SurveyAppraisalsService } from '../../survey-appraisals/survey-appraisals.service';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';

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
  selector: 'jhi-collateral-appraisal-info',
  templateUrl: './collateral-appraisal-info.component.html',
  styleUrls: ['./collateral-appraisal-info.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CollateralAppraisalInfoComponent implements OnInit, OnChanges {
  public segments: IInternal[];
  public regionals: IInternal[];
  public branchs: IInternal[];
  public positionRM: IPosition[];
  public rmSegment: IInternal;
  public rmRegional: IInternal;
  public rmBranch: IInternal;
  public rmPosition: IPosition;
  public statusId: string;
  public statusRealTime = [];
  public _collateralAPpraisal: ICollateralAppraisal;
  public account: Account;
  public kjppValue: any;
  public disableRmInfo: boolean;
  validityDate = new FormControl(moment().toDate());
  appraisalValidityPeriod: boolean;

  @Input()
  get collateralAppraisal() {
    return this._collateralAPpraisal;
  }

  set collateralAppraisal(item: ICollateralAppraisal) {
    this._collateralAPpraisal = item;
  }

  @Input() statusAppraisal: ISurveyAppraisals[];

  @Input()
  public accountAuthorities?: Object[];

  private _surveyAppraisal: ISurveyAppraisals;
  @Input()
  get surveyAppraisal() {
    return this._surveyAppraisal;
  }
  set surveyAppraisal(data: ISurveyAppraisals) {
    this._surveyAppraisal = data;
    this.initializeRole();
    this.setMatrixInput();
    this.loadWilayah();
  }

  @Output() outputTipeOfficerAppraisal = new EventEmitter();
  @Output() outputWilayahKota = new EventEmitter();
  @Output() outputTeamReviewer = new EventEmitter();
  @Output() outputWilayahKotaInternal = new EventEmitter();
  @Output() outputSurveyor = new EventEmitter();

  @Output() jpRenewal = new EventEmitter<Boolean>();
  @Output() jpNew = new EventEmitter<Boolean>();
  @Output() jpAdditional = new EventEmitter<Boolean>();
  @Output() jpProgress = new EventEmitter<Boolean>();
  @Output() jpOther = new EventEmitter<Boolean>();
  @Output() appraisalValidity = new EventEmitter();
  public branch?: string;
  public bmRm?: string;
  public totalPlafond?: number;
  public noRequestAppraisal?: string;
  public jenisObject?: string;
  public tipeOfficerAppraisalValue?: string;
  public wilayahKotaFields: Object = { text: 'facilityName', value: 'id' };
  public wilayahKotaInternalValue: number;
  public wilayahKotaExternalValue: number;

  // public teamReviewerFields: Object = { text: 'employeeFirstName', value: 'id' };
  public teamReviewerFields: Object = { text: 'employeeFirstName', value: 'employeeId' };

  public officerAppraisalFields?: Object = { text: 'employeeFirstName', value: 'id' };
  public officerAppraisalValue?: string;
  public approvalDate: string;
  public visitDate: string;
  public renewalVal?: string;
  public newVal?: string;
  public additionalVal?: string;
  public progressVal?: string;
  public reappraisalVal?: string;
  public otherVal?: string;

  public isRoleSU?: boolean;
  public isRoleRM?: boolean;
  public isRoleAA?: boolean;
  public isRole?: boolean;
  public isEnableKhususPerpanjanganSub?: boolean;
  public isEnablePlafond?: boolean;
  public isEnablePermohonan?: boolean;
  public cities: IStateBoundary[];
  public internals: IInternal[];
  public surveyors: ISurveyor[];

  public teamReviewer: any[];
  public officer: any[];
  public tempSurveyor: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private stateBoundaryService: StateBoundaryService,
    private surveyorService: SurveyorService,
    private internalService: InternalService,
    private positionService: PositionService,
    private surveyBatchService: SurveyBatchService,
    private partnerService: PartnerService,
    protected applicationStateLogService: ApplicationStateLogService,
    private surveyAppraisalsService: SurveyAppraisalsService
  ) {
    this.internals = [];
    this.rmRegional = new Internal();
    this.rmPosition = new Position();
    this.rmBranch = new Internal();
    this.rmSegment = new Internal();
    this.statusId = '';
    this.approvalDate = '';
    this.visitDate = '';
  }
  public timeLineStatus: any[];
  public timeLine() {
    this.applicationStateLogService
      .findByBusinessKeyAndRefKey('APPRAISAL', this.collateralAppraisal.id || this.surveyAppraisal.id)
      .subscribe(res => {
        if (res.body.length > 0) {
          for (let i = 0; i < res.body.length; i++) {
            if (res.body[i].status === 'APPROVED') {
              this.approvalDate = moment(res.body[i].createdDate).format('yyyy/MM/dd');
            }

            if (this.collateralAppraisal.apprOfficer === 'Internal' || this.surveyAppraisal.apprOfficer === 'Internal') {
              if (this.collateralAppraisal.statusId === res.body[i].status) {
                this.visitDate = res.body[i].lastModifiedDate.toString();
              }
            }
          }
        }
      });
  }
  public disabledVisited() {
    if (this.surveyAppraisal.statusId === 'VISITED' || this.surveyAppraisal.statusId === 'RETURN_TO_OFFICER') {
      this.appraisalValidityPeriod = false;
    } else {
      this.appraisalValidityPeriod = true;
    }
  }
  ngOnInit(): void {
    this.disabledVisited();
    this.isEnablePlafond;
    this.checkLogin();
    this.surveyAppraisal.jpRenewal === null && this.surveyAppraisal.jpRenewal === false;
    this.loadSurveyBatchKjjp();
    this.loadBranchNew();

    this.timeLine();

    this.surveyorService.query({ size: 9999 }).subscribe(res => {
      this.surveyors = res.body;
    });

    if (this.collateralAppraisal.apprOfficer === 'External' || this.surveyAppraisal.apprOfficer === 'External') {
      this.visitDate = this.surveyAppraisal.apprDate.toString();
    }
  }

  private loadWilayah(): void {
    this.internalService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.cities = res.body;
        for (let i = 0; i < res.body.length; i++) {
          if (Number(res.body[i].id) === Number(this.surveyAppraisal.surveyorArea)) {
            this.wilayahKotaExternalValue = res.body[i].id;
            this.wilayahKotaInternalValue = res.body[i].id;
          }
        }

        this.positionService
          // .queryFilterBy({
          .cashQueryFilterBy({
            page: 0,
            size: 9999,
            idInternal: this.wilayahKotaInternalValue,
            idPositionType: 'SURVEYOR',
            active: true,
          })
          .subscribe(resA => {
            const surveyor = [];
            for (let i = 0; i < resA.body.length; i++) {
              // if (resA.body[i].partyId && resA.body[i].partyId !== null) {
              surveyor.push({
                // employeeFirstName: resA.body[i].employeeFirstName + ' ' + resA.body[i].employeeLastName,
                // Menghindari first name atau last name null jika null akan dibuat string kosong
                employeeFirstName:
                  (resA.body[i].employeeFirstName !== null ? resA.body[i].employeeFirstName : '') +
                  ' ' +
                  (resA.body[i].employeeLastName !== null ? resA.body[i].employeeLastName : ''),
                partyId: resA.body[i].partyId,
                id: resA.body[i].id,
              });
              // }
            }

            this.officer = surveyor;
            this.surveyAppraisalsService.find(this.surveyAppraisal.id).subscribe(resSA => {
              // this.tempSurveyor = resSA.body.surveyorPersonId;
              this.tempSurveyor = Number(resSA.body.surveyorPositionId);
            });
          });
      });
  }

  public setRenewal(ev) {
    if (this.isRm()) {
      this.surveyAppraisal.jpRenewal = !this.surveyAppraisal.jpRenewal;
      if (this.surveyAppraisal.jpRenewal || this.surveyAppraisal.jpAdditional === true) {
        this.isEnablePlafond = true;
      } else {
        this.isEnablePlafond = false;
        this.resetValues();
      }
    }
    this.jpRenewal.emit(ev.checked);
  }

  resetValues() {
    this.surveyAppraisal.totalPlafond = null;
    this.surveyAppraisal.tglJatuhTempo = null;
  }

  public setNew(ev) {
    this.jpNew.emit(ev.checked);
  }

  public setAdditional(ev) {
    if (this.isRm()) {
      this.surveyAppraisal.jpAdditional = !this.surveyAppraisal.jpAdditional;
      if (this.surveyAppraisal.jpAdditional || this.surveyAppraisal.jpRenewal === true) {
        this.isEnablePlafond = true;
      } else {
        this.isEnablePlafond = false;
        this.resetValues();
      }
    }
    this.jpAdditional.emit(ev.checked);
  }

  public setProgress(ev) {
    this.jpProgress.emit(ev.checked);
  }

  public setOther(ev) {
    this.jpOther.emit(ev.checked);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.jpRenewal.emit(this.surveyAppraisal.jpRenewal);
    this.jpNew.emit(this.surveyAppraisal.jpNew);
    this.jpAdditional.emit(this.surveyAppraisal.jpAdditional);
    this.jpProgress.emit(this.surveyAppraisal.jpProgress);
    this.jpOther.emit(this.surveyAppraisal.jpOther);
    this.appraisalValidity.emit(this.surveyAppraisal.thruDate);
    this.loadWilayah();

    if (changes['collateralAppraisal']) {
      if (this.surveyAppraisal.ownerPosition.partyId) {
        this.loadPositionRM();
        this.loadInternalInformationRM(this.surveyAppraisal.ownerPosition.partyId);
      }

      if (this.collateralAppraisal.apprOfficer === 'External' || this.surveyAppraisal.apprOfficer === 'External') {
        this.visitDate = this.surveyAppraisal.apprDate.toString();
      }
    }
    if (changes['surveyAppraisal']) {
      if (this.surveyAppraisal.ownerPosition.partyId) {
        this.loadPositionRM();
        this.loadInternalInformationRM(this.surveyAppraisal.ownerPosition.partyId);
      }
      if (this.surveyAppraisal.apprOfficer === 'External' || this.collateralAppraisal.apprOfficer === 'External') {
        this.visitDate = this.surveyAppraisal.apprDate.toString();
      }
      this.loadWilayah();
    }

    if (changes.statusAppraisal.currentValue.length > 0) {
      for (let i = 0; i < changes.statusAppraisal.currentValue.length; i++) {
        if (changes.statusAppraisal.currentValue[i].status === 'APPROVED') {
          this.approvalDate = changes.statusAppraisal.currentValue[i].createdDate;
        }
      }
    }
  }

  private loadInternalInformationRM(partyId: string): void {
    this.branchs = [];
    this.segments = [];
    this.regionals = [];
    this.findPositionByIdParty(partyId).then((res: IPosition) => {
      if (res) {
        this.loadInternalById(res.internalId).then((res2: IInternal) => {
          this.rmBranch = res2;
          this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
            this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
              this.rmRegional = res4;
              this.loadRegional(this.rmRegional.parentId.toString()).then(res5 => {
                this.loadInternalById(this.rmRegional.parentId.toString()).then(res6 => {
                  this.rmSegment = res6;
                  this.loadSegment();
                });
              });
            });
          });
        });
      }
    });
  }

  private loadInternalById(internalId: string): Promise<IInternal> {
    return new Promise<IInternal>((resolve, reject) => {
      this.internalService.find(internalId).subscribe(res => {
        if (res.body) {
          resolve(res.body);
        } else {
          resolve(null);
        }
      });
    });
  }

  private findPositionByIdParty(partyId: string): Promise<IPosition> {
    return new Promise<IPosition>((resolve, reject) => {
      if (this.surveyAppraisal.ownerPosition.partyId) {
        this.positionService.queryFilterBy({ idParty: partyId, size: 1, page: 0 }).subscribe(res => {
          if (res.body.length > 0) {
            this.rmPosition = res.body[0];
            resolve(this.rmPosition);
          } else {
            resolve(null);
          }
        });
      }
    });
  }

  public selectRM(event: any): void {
    const value: string = event['value'];
    if (value) {
      const position: IPosition = lodash.find(this.positionRM, function (o) {
        return o.id === parseInt(value, 10);
      });
      this.surveyAppraisal.ownerPosition.partyId = position.partyId;
      this.loadInternalInformationRM(position.partyId);
    } else {
      this.surveyAppraisal.ownerPosition.partyId = null;
    }
  }

  private loadPositionRM(): void {
    this.positionService.queryFilterBy({ idPositionType: POSITION_TYPE.RM, size: 9999, page: 0 }).subscribe(res => {
      this.positionRM = lodash.filter(res.body, function (o) {
        return o.partyId !== null;
      });
    });
  }

  private loadSegment(): void {
    this.internalService.queryFilterBy({ idInternalType: APPLICATION_TYPE.BUSINESS_UNIT, size: 9999, page: 0 }).subscribe(res => {
      this.segments = res.body;
    });
  }

  private loadRegional(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.regionals = res.body;
        resolve();
      });
    });
  }

  private loadBranch(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.branchs = res.body;
        resolve();
      });
    });
  }

  private loadBranchNew(): void {
    const tmpBranch = [];
    this.internalService
      .query({
        page: 0,
        size: 999,
      })
      .subscribe(response => {
        for (let a = 0; a < response.body.length; a++) {
          if (response.body[a].internalTypeId === 'BRANCH') {
            tmpBranch.push(response.body[a]);
          }
        }
        this.branchs = tmpBranch;
        this.loadSegment();
      });
  }

  private loadInternalInformationBranch(parentId): void {
    this.segments = [];
    this.regionals = [];
    this.loadInternalById(parentId).then(res4 => {
      this.loadRegional(res4.parentId.toString()).then(res5 => {
        this.loadInternalById(res4.parentId.toString()).then(res6 => {
          this.rmSegment = res6;
          this.loadSegment();
        });
      });
    });
  }

  private initializeRole(): void {
    this.isRoleSU = false;
    this.isRoleRM = false;
    this.isRoleAA = false;

    if (this.accountService.hasAnyAuthority('ROLE_RM')) {
      this.isRoleRM = true;
    }

    if (this.accountService.hasAnyAuthority('ROLE_ADMIN')) {
      this.isRoleSU = true;
    }

    if (this.accountService.hasAnyAuthority('ROLE_ADMIN_APPRAISER')) {
      this.isRoleAA = true;
    }

    this.isRoleRM = this.isRoleSU ? false : this.isRoleRM;
    this.isRoleAA = this.isRoleSU ? true : this.isRoleAA;
  }

  private setMatrixInput(): void {
    this.isEnableKhususPerpanjanganSub = false;
    this.isEnablePlafond = false;

    if (this.isRoleRM) {
      if (this.surveyAppraisal.statusId === 'DRAFT' || this.surveyAppraisal.statusId === 'RETURN_TO_RM') {
        this.isEnableKhususPerpanjanganSub = true;
        if (this.surveyAppraisal.jpRenewal === true) {
          this.isEnablePlafond = true;
        } else {
          this.isEnablePlafond = false;
        }
      }
    }
  }
  public externalDisabled() {
    if (this.collateralAppraisal.apprOfficer === 'External') {
      return true;
    } else {
      return false;
    }
  }
  public selectWilayahKota(args: ChangeEventArgs): void {
    this.outputWilayahKota.emit(args['value']);
    this.positionService
      .queryFilterBy({
        page: 0,
        size: 9999,
        idInternal: args['value'],
      })
      .subscribe(res => {
        const teamLeader = [];
        for (let i = 0; i < res.body.length; i++) {
          if (res.body[i].positionTypeDescription === 'Team Leader') {
            teamLeader.push({
              // Menghindari first name atau last name null jika null akan dibuat string kosong
              employeeFirstName:
                (res.body[i].employeeFirstName !== null ? res.body[i].employeeFirstName : '') +
                ' ' +
                (res.body[i].employeeLastName !== null ? res.body[i].employeeLastName : ''),
              id: res.body[i].id,
              employeeId: res.body[i].employeeId,
            });
          }
        }

        this.teamReviewer = teamLeader;
      });
    this.cdr.detectChanges();
    this.surveyAppraisal.surveyorArea = args['itemData'].id;
  }

  public selectTeamReviewer(args: ChangeEventArgs): void {
    // this.surveyAppraisal.teamLeadId = args['itemData'].id;
    this.surveyAppraisal.teamLeadId = args['itemData'].employeeId;
    this.surveyAppraisal.teamLeadPersonId = args['itemData'].employeeId;
    this.surveyAppraisal.teamLeadName = args['itemData'].employeeFirstName;
    this.surveyAppraisal.reviewedBy = args['itemData'].employeeFirstName;
    this.outputTeamReviewer.emit(args['value']);
  }

  public selectWilayahKotaInternal(args: ChangeEventArgs): void {
    this.outputWilayahKotaInternal.emit(args['value']);
    this.positionService
      // .queryFilterBy({
      .cashQueryFilterBy({
        page: 0,
        size: 9999,
        idInternal: args['value'],
        idPositionType: 'SURVEYOR',
        active: true,
      })
      .subscribe(res => {
        const surveyor = [];
        for (let i = 0; i < res.body.length; i++) {
          // if (res.body[i].partyId && res.body[i].partyId !== null) {
          surveyor.push({
            // employeeFirstName: res.body[i].employeeFirstName + ' ' + res.body[i].employeeLastName,
            // Menghindari first name atau last name null jika null akan dibuat string kosong
            employeeFirstName:
              (res.body[i].employeeFirstName !== null ? res.body[i].employeeFirstName : '') +
              ' ' +
              (res.body[i].employeeLastName !== null ? res.body[i].employeeLastName : ''),
            partyId: res.body[i].partyId,
            id: res.body[i].id,
          });
          // }
        }

        this.officer = surveyor;
      });
    this.cdr.detectChanges();
    this.surveyAppraisal.surveyorArea = args['itemData'].id;
  }

  public selectSurveyor(args: ChangeEventArgs): void {
    this.surveyorService.queryFilterBy({ idPerson: args['itemData'].partyId }).subscribe(res => {
      if (res.body.length > 0) {
        this.surveyAppraisal.surveyorId = res.body[0].id;
        // this.tempSurveyor = res.body[0].id;
      }
    });
  }

  private checkLogin() {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.account = account;
        this.disableRmInfo = this.account.login === 'admin' ? false : true;
      }
    });
  }

  public isRm(): any {
    return this.account.authorities.includes('ROLE_RM');
  }

  public loadSurveyBatchKjjp(): void {
    this.surveyBatchService.find(this.collateralAppraisal.surveyBatchId).subscribe(res => {
      this.partnerService.find(res.body.surveyCompanyId).subscribe(ress => {
        this.kjppValue = ress.body.name;
      });
    });
  }
}
