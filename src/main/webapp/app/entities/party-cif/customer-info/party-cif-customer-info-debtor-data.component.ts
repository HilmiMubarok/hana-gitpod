import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IPosition } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';

import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import {
  APPLICATION_TYPE,
  CATEGORY_DEBTOR,
  COLLECTABILITY_STATUS,
  POSITION_TYPE,
  RELATION_WITH_HANA,
  UMKM_CLASSIFICATION,
} from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { IDebtorData } from '../../debtor-data/debtor-data.model';
import { IPartyCif } from '../party-cif.model';
import { PartyCifService } from '../party-cif.service';
import moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';

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
  selector: 'jhi-party-cif-customer-info-debtor-data',
  templateUrl: './party-cif-customer-info-debtor-data.component.html',
  styleUrls: ['../party-cif.style.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PartyCifCustomerInfoDebtorDataComponent extends AbstractEntityViewPageComponent<IDebtorData> implements OnInit, OnChanges {
  public categoryDebtor: any;
  public umkmClassification: any;
  private _cif: IPartyCif;
  public value: string;
  public separate: string;
  public creditType = [];
  public golongan = [];
  public internals: IInternal[];
  public segments: IInternal[];
  public regionals: IInternal[];
  public branchs: IInternal[];
  public positionRM: IPosition[];
  public rmSegment: IInternal;
  public rmRegional: IInternal;
  public rmBranch: IInternal;
  public rmPosition: IPosition;
  public positionRMS: IPosition;
  public individu: any;
  moment = _rollupMoment || _moment;

  date = new FormControl(moment());

  @Input() customerType: string;
  creditTypeValue: any;
  golonganValue: any;

  @Input()
  get partyCif() {
    return this._cif;
  }

  set partyCif(data: IPartyCif) {
    this._cif = data;
  }
  public ifcRiskCategoryData = [];
  public relationWithClient: any;
  public collectabilityStatus: any;
  public lineOfBussines: any;
  public callReportCategoryData = [];
  public pep = [];
  constructor(
    private internalService: InternalService,
    protected activatedRoute: ActivatedRoute,
    protected partyCifService: PartyCifService,
    private positionService: PositionService,
    protected generalParameterService: GeneralParameterService
  ) {
    super();
    this.relationWithClient = RELATION_WITH_HANA;
    this.collectabilityStatus = COLLECTABILITY_STATUS;
    this.categoryDebtor = CATEGORY_DEBTOR;
    this.umkmClassification = UMKM_CLASSIFICATION;

    this.rmBranch = new Internal();
    this.rmRegional = new Internal();
    this.rmSegment = new Internal();
  }
  ngOnInit(): void {
    this.test();
    this.getDate();
    this.CollectabilityStatus();
    this.showHideElement();
    this.lovCallreport();
    this.getLov();
    this.lovPep();
    this.changePenjualan();
    this.changeModal();
    this.changeCorres();
    this.changeSector();
    this.loadCreditType();
    this.loadGolongan();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadInternalInformationRM(this.partyCif.rm.id);
  }

  currencyInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }
  public getLov() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'IFC_AND_RISK_CATEGORY',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.ifcRiskCategoryData = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public test() {
    if (this.partyCif.debtorData.separateAssetAggrement === true && this.partyCif.debtorData.separateAssetAggrement !== undefined) {
      this.separate = '';
    } else if (this.partyCif.debtorData.separateAssetAggrement === false && this.partyCif.debtorData.separateAssetAggrement !== undefined) {
      this.separate = 'N/A';
    } else {
      this.separate = '';
    }
  }
  public lovCallreport() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'CALL_REPORT_CATEGORY',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.callReportCategoryData = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public lovPep() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'PEP_STATUS',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.pep = res.body;
      });
  }
  public CollectabilityStatus() {
    if (this.partyCif.debtorData.collectabilityStatus === ' ') {
      this.collectabilityStatus = '1';
    }
  }

  public year: any;
  getDate() {
    const dataYear = this.partyCif.debtorData.occupiedSince;
    this.year = dataYear.toString()?.slice(0, 4);
    const formatDate = this.year.replace(/-/g, '/');
    this.partyCif.debtorData.occupiedSince = formatDate;
  }

  private loadPositionRM(): void {
    const tempId = this.partyCif.rm.id;
    this.positionService.queryFilterBy({ idPositionType: POSITION_TYPE.RM, size: 9999, page: 0 }).subscribe(res => {
      this.positionRM = lodash.filter(res.body, function (o) {
        return o.partyId !== null;
      });

      this.positionRMS = lodash.find(res.body, function (o) {
        return o.partyId === tempId;
      });

      this.loadInternalInformationRM(this.positionRMS.partyId);
    });
  }

  private loadInternalInformationRM(partyId: string): void {
    this.branchs = [];
    this.segments = [];
    this.regionals = [];
    this.findPositionByIdParty(partyId).then((res: IPosition) => {
      if (res) {
        this.loadInternalById(res.internalId).then((res2: IInternal) => {
          if (res2.parentId) {
            this.rmBranch = res2;

            this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
              this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
                if (res4.parentId) {
                  this.rmRegional = res4;
                }
              });
            });
          }
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
      if (this.partyCif.rm.id) {
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

  private loadBranch(value: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.internalService.queryFilterBy({ idParent: value, size: 9999, page: 0 }).subscribe(res => {
        this.branchs = res.body;
        resolve();
      });
    });
  }

  public select(event): void {
    for (let i = 0; i < this.branchs.length; i++) {
      if (event.value === this.branchs[i].id) {
        this.partyCif.debtorData.bookingBranch = this.branchs[i].id.toString();
      }
    }
  }

  public showHideElement() {
    if (this.customerType !== 'PERSONAL') {
      this.individu = 'none';
    }
  }
  public changePenjualan() {
    if (this.partyCif.debtorData.annualSalesName === null || this.partyCif.debtorData.annualSalesName === undefined) {
      return 'N/A';
    }
    return this.partyCif.debtorData.annualSalesName;
  }

  public changeCorres() {
    if (this.partyCif.debtorData.correspondenceAddress === null || this.partyCif.debtorData.correspondenceAddress === undefined) {
      return 'N/A';
    }
    return this.partyCif.debtorData.correspondenceAddress;
  }
  public changeSector() {
    if (this.partyCif.debtorData.econSectorCode === null || this.partyCif.debtorData.econSectorCode === undefined) {
      return 'N/A';
    }
    return this.partyCif.debtorData.correspondenceAddress;
  }
  public changeModal() {
    if (this.partyCif.debtorData.equityName === null || this.partyCif.debtorData.equityName === undefined) {
      return 'N/A';
    }
    return this.partyCif.debtorData.equityName;
  }
  private loadCreditType(): void {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'CREDIT_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.creditType = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        for (let i = 0; i < this.creditType.length; i++) {
          if (this.creditType[i].code === this.partyCif.debtorData.creditType) {
            this.creditTypeValue = this.creditType[i].value;
          }
        }
      });
  }
  private loadGolongan(): void {
    const customerType = this.partyCif.customerType;

    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'DEBTOR_CLASS',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.golongan = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        if (customerType === 'PERSONAL') {
          this.partyCif.debtorData.golongan = '36';
        } else {
          this.partyCif.debtorData.golongan = '35';
        }
        for (let i = 0; i < this.golongan.length; i++) {
          if (this.golongan[i].code === this.partyCif.debtorData.golongan) {
            this.golonganValue = this.golongan[i].value;
          }
        }
      });
  }
}
