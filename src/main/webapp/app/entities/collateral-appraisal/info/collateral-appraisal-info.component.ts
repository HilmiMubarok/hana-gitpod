import { Component, ChangeDetectorRef, OnChanges, SimpleChanges, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChangeEventArgs } from '@syncfusion/ej2-angular-layouts';
import { AccountService } from 'app/core/auth/account.service';
import { CifService } from 'app/entities/cif/cif.service';
import { IInternal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IPartyCif, PartyCif } from 'app/entities/party-cif/party-cif.model';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { ISurveyAppraisals, SurveyAppraisals } from 'app/entities/survey-appraisals/survey-appraisals.model';
import { ISurveyor } from 'app/entities/surveyor/surveyor.model';
import { SurveyorService } from 'app/entities/surveyor/surveyor.service';
import { ICollateralAppraisal, CollateralAppraisal } from '../collateral-appraisal.model';

@Component({
  selector: 'jhi-collateral-appraisal-info',
  templateUrl: './collateral-appraisal-info.component.html',
  styleUrls: ['../collateral-appraisal-main.css'],
})
export class CollateralAppraisalInfoComponent implements OnChanges, OnInit {
  private _partyCif: IPartyCif = new PartyCif();

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(data: IPartyCif) {
    this._partyCif = data;
  }

  @Input()
  public accountAuthorities?: Object[];

  @Input()
  public collateralAppraisal: ICollateralAppraisal;

  @Input()
  public surveyAppraisal: ISurveyAppraisals;

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
  public cities: IStateBoundary[];
  public internals: IInternal[];
  public surveyors: ISurveyor[];

  constructor(
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private stateBoundaryService: StateBoundaryService,
    private surveyorService: SurveyorService
  ) {
    this.surveyAppraisal = new SurveyAppraisals();
  }

  ngOnInit(): void {
    this.stateBoundaryService.queryFilterBy({ size: 9999, idBoundaryType: 112 }).subscribe(res => {
      this.cities = res.body;
    });

    this.surveyorService.query({ size: 9999 }).subscribe(res => {
      this.surveyors = res.body;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['collateralAppraisal']) {
      this.initializeRole();
      if (this.collateralAppraisal.apprOfficer) {
        this.outputTipeOfficerAppraisal.emit(this.collateralAppraisal.apprOfficer);
      }
    }
  }

  private initializeRole(): void {
    this.isRoleSU = false;
    this.isRoleRM = false;

    if (this.accountService.hasAnyAuthority('ROLE_RM')) {
      this.isRoleRM = true;
    }

    if (this.accountService.hasAnyAuthority('ROLE_ADMIN')) {
      this.isRoleSU = true;
    }

    this.isRoleRM = this.isRoleSU ? false : this.isRoleRM;
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
