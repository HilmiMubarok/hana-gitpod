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
export class PartyCifCustomerInfoDebtorDataComponent extends AbstractEntityViewPageComponent<IDebtorData> implements OnInit, OnChanges {
  public categoryDebtor: any;
  public umkmClassification: any;
  // private _debtorData: IDebtorData;
  private _cif: IPartyCif;
  public value: string;
  public separate: string;

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
  moment = _rollupMoment || _moment;

  date = new FormControl(moment());

  @Input() customerType: string;
  // @Input()
  // get debtorData() {
  //   return this._debtorData;
  // }

  // set debtorData(data: IDebtorData) {
  //   this._debtorData = data;
  // }

  @Input()
  get partyCif() {
    return this._cif;
  }

  set partyCif(data: IPartyCif) {
    this._cif = data;
  }
  public callReportCategoryData = ['Green', 'Yellow (Early Warning)', 'Red (Watch List)'];
  public ifcRiskCategoryData = ['Low', 'Medium', 'High'];
  public relationWithClient: any;
  public collectabilityStatus: any;
  public lineOfBussines: any;
  constructor(
    private internalService: InternalService,
    protected activatedRoute: ActivatedRoute,
    protected partyCifService: PartyCifService,
    private positionService: PositionService
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
    // this.getExis();
    this.CollectabilityStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.loadPositionRM();
    this.loadInternalInformationRM(this.partyCif.rm.id);
  }

  currencyInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  public test() {
    if (this.partyCif.debtorData.separateAssetAggrement === true && this.partyCif.debtorData.separateAssetAggrement !== undefined) {
      this.separate = 'Yes';
    } else if (this.partyCif.debtorData.separateAssetAggrement === false && this.partyCif.debtorData.separateAssetAggrement !== undefined) {
      this.separate = 'No';
    } else {
      this.separate = '';
    }
  }

  public CollectabilityStatus() {
    if (this.partyCif.debtorData.collectabilityStatus === ' ') {
      this.collectabilityStatus = '1';
    }
  }

  public year: any;
  getDate() {
    this.year = new Date(this.partyCif.debtorData.occupiedSince);
    const fullYear = this.year.getFullYear();
    this.partyCif.debtorData.occupiedSince = fullYear;
  }

  // getExis() {
  //   this.year = new Date(this.partyCif.debtorData.customerSince);
  //   const fullYear = this.year.toISOString().split('T')[0];
  //   this.partyCif.debtorData.customerSince = fullYear.replace(/-/g, '/');
  // }

  private loadPositionRM(): void {
    const tempName = this.partyCif.rm.firstName;
    this.positionService.queryFilterBy({ idPositionType: POSITION_TYPE.RM, size: 9999, page: 0 }).subscribe(res => {
      this.positionRM = lodash.filter(res.body, function (o) {
        return o.partyId !== null;
      });

      this.positionRMS = lodash.find(res.body, function (o) {
        return o.employeeFirstName === tempName;
      });

      this.loadInternalInformationRM(this.positionRMS.partyId);
      console.log('ini position', this.positionRM);
      console.log('ini positionRMS', this.positionRMS);
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

            // this.creditProposal.internalId = this.rmBranch.parentId.toString();

            this.loadBranch(this.rmBranch.parentId.toString()).then(res3 => {
              this.loadInternalById(this.rmBranch.parentId.toString()).then(res4 => {
                if (res4.parentId) {
                  this.rmRegional = res4;
                  console.log('ini regional', this.rmRegional);
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
        // this.debtorData.internalName = this.branchs[i].name;
      }
    }
    this.year = new Date(this.partyCif.debtorData.customerSince);
    const fullYear = this.year.toISOString().split('T')[0];
    this.partyCif.debtorData.customerSince = fullYear;
  }
}
