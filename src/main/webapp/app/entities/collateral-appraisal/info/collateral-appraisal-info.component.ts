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
@Component({
  selector: 'jhi-collateral-appraisal-info',
  templateUrl: './collateral-appraisal-info.component.html',
  styleUrls: ['./collateral-appraisal-info.css'],
})
export class CollateralAppraisalInfoComponent implements OnChanges, OnInit {
  // export class CollateralAppraisalInfoComponent implements OnInit {
  public segments: IInternal[];
  public regionals: IInternal[];
  public branchs: IInternal[];
  public positionRM: IPosition[];
  public rmSegment: IInternal;
  public rmRegional: IInternal;
  public rmBranch: IInternal;
  public rmPosition: IPosition;

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
    this.loadInternalInformationRM(this.surveyAppraisal.rm.partyId);
  }

  @Output() outputTipeOfficerAppraisal = new EventEmitter();
  @Output() outputKJPPIndependent = new EventEmitter();
  @Output() outputWilayahKota = new EventEmitter();
  @Output() outputTeamReviewer = new EventEmitter();
  @Output() outputOfficerAppraisal = new EventEmitter();
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
  public wilayahKotaFields: Object = { text: 'description', value: 'id' };
  public wilayahKotaInternalValue?: string;
  public wilayahKotaExternalValue?: string;
  public teamReviewer = [
    { id: '1ANI', description: 'Ani' },
    { id: '2BUDI', description: 'Budi' },
    { id: '3CIKA', description: 'Cika' },
    { id: '4DODI', description: 'Dodi' },
    { id: '5ERI', description: 'Eri' },
    { id: '6FONY', description: 'Fony' },
    { id: '7GILANG', description: 'Gilang' },
    { id: '8HERU', description: 'Heru' },
    { id: '9IJAL', description: 'Ijal' },
    { id: '10KIKI', description: 'Kiki' },
  ];
  public teamReviewerFields: Object = { text: 'description', value: 'id' };
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
  public cities: IStateBoundary[];
  public internals: IInternal[];
  public surveyors: ISurveyor[];

  constructor(
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private stateBoundaryService: StateBoundaryService,
    private surveyorService: SurveyorService,
    private internalService: InternalService,
    private positionService: PositionService
  ) {
    this.surveyAppraisal = new SurveyAppraisals();
    this.internals = [];
    this.rmRegional = new Internal();
    this.rmPosition = new Position();
    this.rmBranch = new Internal();
    this.rmSegment = new Internal();
  }

  ngOnInit(): void {
    this.stateBoundaryService.queryFilterBy({ size: 9999, idBoundaryType: 112 }).subscribe(res => {
      this.cities = res.body;
    });

    this.surveyorService.query({ size: 9999 }).subscribe(res => {
      this.surveyors = res.body;
    });
    this.loadPositionRM();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['collateralAppraisal']) {
      if (this.surveyAppraisal.apprOfficer) {
        this.outputTipeOfficerAppraisal.emit(this.surveyAppraisal.apprOfficer);
      }
    }
    if (changes['collateralAppraisal']) {
      if (this.surveyAppraisal.rm.partyId) {
        this.loadInternalInformationRM(this.surveyAppraisal.rm.partyId);
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

    if (this.isRoleRM) {
      if (this.surveyAppraisal.statusId === 'DRAFT' || this.surveyAppraisal.statusId === 'RETURN_TO_RM') {
        this.isEnableKhususPerpanjanganSub = true;
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
    this.teamReviewer = [
      { id: '1ANI', description: 'Ani' },
      { id: '2BUDI', description: 'Budi' },
      { id: '3CIKA', description: 'Cika' },
      { id: '4DODI', description: 'Dodi' },
      { id: '5ERI', description: 'Eri' },
      { id: '6FONY', description: 'Fony' },
      { id: '7GILANG', description: 'Gilang' },
      { id: '8HERU', description: 'Heru' },
      { id: '9IJAL', description: 'Ijal' },
      { id: '10KIKI', description: 'Kiki' },
    ];
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
    this.cdr.detectChanges();
  }

  public selectTeamReviewer(args: ChangeEventArgs): void {
    this.outputTeamReviewer.emit(args['value']);
  }

  public selectOfficerAppraisal(args: ChangeEventArgs): void {
    this.outputOfficerAppraisal.emit(args['value']);
  }
}
