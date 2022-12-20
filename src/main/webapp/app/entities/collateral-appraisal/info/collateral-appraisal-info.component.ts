import { Component, ChangeDetectorRef, OnChanges, SimpleChanges, Input, Output, EventEmitter, OnInit } from '@angular/core';
// import { Component, ChangeDetectorRef, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
@Component({
  selector: 'jhi-collateral-appraisal-info',
  templateUrl: './collateral-appraisal-info.component.html',
  styleUrls: ['./collateral-appraisal-info.css'],
})
export class CollateralAppraisalInfoComponent implements OnChanges, OnInit {
  // export class CollateralAppraisalInfoComponent implements OnInit {
  public segments: IInternal[];
  public regionals: IInternal[];
  public branches;
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

  @Input()
  get collateralAppraisal() {
    return this._collateralAPpraisal;
  }

  set collateralAppraisal(item: ICollateralAppraisal) {
    console.log('appraisal', item);
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
    // this.loadInternalInformationRM(this.surveyAppraisal.rm.partyId);
  }

  @Output() outputTipeOfficerAppraisal = new EventEmitter();
  @Output() outputKJPPIndependent = new EventEmitter();
  @Output() outputWilayahKota = new EventEmitter();
  @Output() outputTeamReviewer = new EventEmitter();
  @Output() outputOfficerAppraisal = new EventEmitter();

  @Output() jpRenewal = new EventEmitter<Boolean>();
  @Output() jpNew = new EventEmitter<Boolean>();
  @Output() jpAdditional = new EventEmitter<Boolean>();
  @Output() jpProgress = new EventEmitter<Boolean>();
  @Output() jpOther = new EventEmitter<Boolean>();
  public branch?: string;
  public bmRm?: string;
  public segmentProductFields: Object = { text: 'description', value: 'id' };
  public segmentProduct = [
    {
      id: '1SME',
      description: 'SME',
    },
    {
      id: '2CORPORATEBANK',
      description: 'Corporate Bank',
    },
    {
      id: '3COMMERCIALBANK',
      description: 'Commercial Bank',
    },
    {
      id: '4KOREANDESK',
      description: 'Korean Desk',
    },
    {
      id: '5ENTERPRISEBANKING',
      description: 'Enterprise Banking',
    },
  ];
  public segmentProductValue?: string;
  public totalPlafond?: number;
  public noRequestAppraisal?: string;
  public jenisObject?: string;
  public tipeOfficerAppraisalValue?: string;
  public kjppIndependentAppraisal = [
    {
      id: '1KJPP',
      description: 'KJPP',
    },
    {
      id: '2INDEPENDENT',
      description: 'Independent',
    },
  ];
  public kjppIndependentAppraisalFields: Object = { text: 'description', value: 'id' };
  public kjppIndependentAppraisalValue?: string;
  public wilayahKota = [
    { id: '1JAKARTA', description: 'Jakarta' },
    { id: '2BANDUNG', description: 'Bandung' },
    { id: '3YOGYAKARTA', description: 'Yogyakarta' },
    { id: '4SEMARANG', description: 'Semarang' },
    { id: '5SURABAYA', description: 'Surabaya' },
    { id: '6MEDAN', description: 'Medan' },
    { id: '7PALEMBANG', description: 'Palembang' },
    { id: '8PEKANBARU', description: 'Pekan Baru' },
    { id: '9BANDARLAMPUNG', description: 'Bandar Lampung' },
    { id: '10DENPASAR', description: 'Denpasar' },
  ];
  public wilayahKotaFields: Object = { text: 'facilityName', value: 'id' };
  public wilayahKotaInternalValue?: string;
  public wilayahKotaExternalValue?: string;

  public teamReviewerFields: Object = { text: 'employeeFirstName', value: 'id' };
  public teamReviewerValue: string;
  public officerAppraisal = [
    { id: '1ZUKI', description: 'Zuki' },
    { id: '2YANI', description: 'Yani' },
    { id: '3XAVI', description: 'Xavi' },
    { id: '4WILI', description: 'Wili' },
    { id: '5VICTOR', description: 'Victor' },
    { id: '6UMI', description: 'Umi' },
    { id: '7TIKA', description: 'Tika' },
    { id: '8SUBI', description: 'Subi' },
    { id: '9ROMI', description: 'Romi' },
    { id: '10QUENY', description: 'Queny' },
  ];
  public officerAppraisalFields?: Object = { text: 'personName', value: 'id' };
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

  constructor(
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private stateBoundaryService: StateBoundaryService,
    private surveyorService: SurveyorService,
    private internalService: InternalService,
    private positionService: PositionService,
    private surveyBatchService: SurveyBatchService,
    private partnerService: PartnerService
  ) {
    this.surveyAppraisal = new SurveyAppraisals();
    this.internals = [];
    this.rmRegional = new Internal();
    this.rmPosition = new Position();
    this.rmBranch = new Internal();
    this.rmSegment = new Internal();
    this.statusId = '';
    this.approvalDate = '';
    this.visitDate = '';
  }

  ngOnInit(): void {
    this.isEnablePlafond;
    this.checkLogin();

    this.loadPositionRM();

    this.surveyAppraisal.jpRenewal === null && this.surveyAppraisal.jpRenewal === false;
    this.loadSurveyBatchKjjp();
    this.loadBranchNew();
    this.loadWilayah();
  }

  private loadWilayah(): void {
    this.internalService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.cities = res.body;
      });
  }

  public setRenewal(ev) {
    if (this.isRm()) {
      if (this.account.authorities.length <= 2) {
        this.surveyAppraisal.jpRenewal = !this.surveyAppraisal.jpRenewal;
        if (this.surveyAppraisal.jpRenewal === true) {
          this.isEnablePlafond = true;
        } else {
          this.isEnablePlafond = false;
          this.resetValues();
        }
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

    if (changes['collateralAppraisal']) {
      if (this.surveyAppraisal.apprOfficer) {
        this.outputTipeOfficerAppraisal.emit(this.surveyAppraisal.apprOfficer);
      }
    }
    if (changes['collateralAppraisal']) {
      // if (this.surveyAppraisal.rm.partyId) {
      //   this.loadInternalInformationRM(this.surveyAppraisal.rm.partyId);
      // }
    }

    if (changes.statusAppraisal.currentValue.length > 0) {
      for (let i = changes.statusAppraisal.currentValue.length - 1; i >= 0; i--) {
        if (changes.statusAppraisal.currentValue[i].status === 'APPROVAL' || changes.statusAppraisal.currentValue[i].status === 'VISITED') {
          if (changes.statusAppraisal.currentValue[i].status === 'APPROVAL') {
            this.approvalDate = changes.statusAppraisal.currentValue[i].createdDate;
          } else {
            console.log('visit', changes.statusAppraisal.currentValue[i].createdDate);
            this.visitDate = changes.statusAppraisal.currentValue[i].createdDate;
          }
        }
      }
    }
  }

  private loadInternalInformationRM(partyId: string): void {
    this.branches = [];
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
      if (this.surveyAppraisal.rm.partyId) {
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
      this.surveyAppraisal.rm.partyId = position.partyId;
      this.loadInternalInformationRM(position.partyId);
    } else {
      this.surveyAppraisal.rm.partyId = null;
    }
  }

  private loadPositionRM(): void {
    this.positionService.queryFilterBy({ idPositionType: POSITION_TYPE.RM, size: 9999, page: 0 }).subscribe(res => {
      this.positionRM = lodash.filter(res.body, function (o) {
        return o.partyId !== null;
      });

      console.log('PosRM', this.positionRM);
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
        this.branches = res.body;
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
        this.branches = tmpBranch;
        this.loadSegment();
      });
  }

  public selectBranch(event: any): void {
    const value: string = event['value'];
    if (value) {
      console.log('value', value);
      console.log('branches', this.branches);
      const branch = lodash.find(this.branches, function (o) {
        return o.id === value;
      });

      console.log('branch', branch);
      this.loadInternalInformationBranch(branch.parentId);
    }
  }

  private loadInternalInformationBranch(parentId): void {
    this.segments = [];
    this.regionals = [];
    this.loadInternalById(parentId).then(res4 => {
      // this.rmRegional = res4;
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

  public selectTipeOfficerAppraisal(args: ChangeEventArgs): void {
    this.clearDefaultSelection();
    this.outputTipeOfficerAppraisal.emit(args['value']);
    this.cdr.detectChanges();
  }

  private clearDefaultSelection(): void {
    this.kjppIndependentAppraisalValue = '';
    this.wilayahKotaInternalValue = '';
    this.wilayahKotaExternalValue = '';
    this.wilayahKota = [
      { id: '1JAKARTA', description: 'Jakarta' },
      { id: '2BANDUNG', description: 'Bandung' },
      { id: '3YOGYAKARTA', description: 'Yogyakarta' },
      { id: '4SEMARANG', description: 'Semarang' },
      { id: '5SURABAYA', description: 'Surabaya' },
      { id: '6MEDAN', description: 'Medan' },
      { id: '7PALEMBANG', description: 'Palembang' },
      { id: '8PEKANBARU', description: 'Pekan Baru' },
      { id: '9BANDARLAMPUNG', description: 'Bandar Lampung' },
      { id: '10DENPASAR', description: 'Denpasar' },
    ];
    this.teamReviewerValue = '';

    this.officerAppraisalValue = '';
    this.officerAppraisal = [
      { id: '1ZUKI', description: 'Zuki' },
      { id: '2YANI', description: 'Yani' },
      { id: '3XAVI', description: 'Xavi' },
      { id: '4WILI', description: 'Wili' },
      { id: '5VICTOR', description: 'Victor' },
      { id: '6UMI', description: 'Umi' },
      { id: '7TIKA', description: 'Tika' },
      { id: '8SUBI', description: 'Subi' },
      { id: '9ROMI', description: 'Romi' },
      { id: '10QUENY', description: 'Queny' },
    ];
    this.cdr.detectChanges();
  }

  public selectKJPPIndependent(args: ChangeEventArgs): void {
    if (args['value'] === '2INDEPENDENT') {
      this.wilayahKota = [
        { id: '1MANADO', description: 'Manado' },
        { id: '2PALU', description: 'Palu' },
        { id: '3GORONTALO', description: 'Gorontalo' },
        { id: '4PANGKALPINANG', description: 'Pangkal Pinang' },
        { id: '5TEGAL', description: 'Tegal' },
        { id: '6MAGELANG', description: 'Magelang' },
        { id: '7MAKASAR', description: 'Makasar' },
        { id: '8PEKALONGAN', description: 'Pekalongan' },
        { id: '9PONTIANAK', description: 'Pontianak' },
        { id: '10BANJARMASIN', description: 'Banjarmasin' },
      ];
    } else {
      this.wilayahKota = [
        { id: '1JAKARTA', description: 'Jakarta' },
        { id: '2BANDUNG', description: 'Bandung' },
        { id: '3YOGYAKARTA', description: 'Yogyakarta' },
        { id: '4SEMARANG', description: 'Semarang' },
        { id: '5SURABAYA', description: 'Surabaya' },
        { id: '6MEDAN', description: 'Medan' },
        { id: '7PALEMBANG', description: 'Palembang' },
        { id: '8PEKANBARU', description: 'Pekan Baru' },
        { id: '9BANDARLAMPUNG', description: 'Bandar Lampung' },
        { id: '10DENPASAR', description: 'Denpasar' },
      ];
    }
    this.outputKJPPIndependent.emit(args['value']);
    this.cdr.detectChanges();
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
            teamLeader.push(res.body[i]);
          }
        }

        this.teamReviewer = teamLeader;
      });
    this.cdr.detectChanges();
  }

  public selectTeamReviewer(args: ChangeEventArgs): void {
    this.outputTeamReviewer.emit(args['value']);
  }

  public selectOfficerAppraisal(args: ChangeEventArgs): void {
    this.outputOfficerAppraisal.emit(args['value']);
  }

  private checkLogin() {
    this.accountService.identity().subscribe(account => {
      console.log('account', account);
      if (account) {
        this.account = account;

        this.disableRmInfo = this.account.login === 'admin' ? false : true;
      }
    });
  }

  public isRm(): any {
    console.log('role', this.account);
  }
  public loadSurveyBatchKjjp(): void {
    this.surveyBatchService.find(this.collateralAppraisal.surveyBatchId).subscribe(res => {
      this.partnerService.find(res.body.surveyCompanyId).subscribe(ress => {
        this.kjppValue = ress.body.name;
      });
    });
  }
}
