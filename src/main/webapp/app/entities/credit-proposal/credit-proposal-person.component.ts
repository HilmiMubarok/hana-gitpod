import { Component, OnChanges, SimpleChanges, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { Person, IPerson } from '../person/person.model';
import { PersonService } from '../person/person.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE, GENDER, MARITAL_STATUS } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IReligionType } from 'app/entities/religion-type/religion-type.model';
import { ReligionTypeService } from 'app/entities/religion-type/religion-type.service';
import { IWorkType } from 'app/entities/work-type/work-type.model';
import { WorkTypeService } from 'app/entities/work-type/work-type.service';

// library
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { MasterInitialDebtorDataService } from '../master-initial-debtor-data/master-initial-debtor-data.service';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { HttpResponse } from '@angular/common/http';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import _ from 'lodash';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment from 'moment';
import { ICreditProposal } from './credit-proposal.model';
import { CATEGORY_DEBTOR, COLLECTABILITY_STATUS, RELATION_WITH_HANA, UMKM_CLASSIFICATION } from 'app/shared/constants/base.constants';
import { PartyCifService } from '../party-cif/party-cif.service';
import { GeneralParameterService } from '../master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
import { IApplicationProduct } from '../application-product/application-product.model';
import { MasterProductParameterService } from '../master-parameter/master-product/master-product-parameter.service';

moment.locale('id');

@Component({
  selector: 'jhi-credit-proposal-person',
  templateUrl: './credit-proposal-person.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'id',
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class CreditProposalPersonComponent extends AbstractEntityBaseViewComponent<IPerson> implements OnChanges, OnInit {
  @Input()
  public disableMaritalStatus: Boolean = false;

  @Output()
  public selectMaritalStatus: EventEmitter<IOptionNode> = new EventEmitter<IOptionNode>();
  public selectGenders: EventEmitter<IOptionNode> = new EventEmitter<IOptionNode>();

  readonly CODE: typeof CODE = CODE;
  public maxDate: Date = new Date();
  public fields: Object = { text: 'description', value: 'id' };
  public fieldsOptionNode: Object = { text: 'label', value: 'id' };
  public disabled: boolean;
  public bloodTypes: IOptionNode[];
  public maritalStatuses: IOptionNode[];
  public genders: IOptionNode[];
  private _deptorData: ICreditProposal;
  public ifcRiskCategory: string;
  public callReportCategory: string;
  @Input()
  get deptorData() {
    return this._deptorData;
  }

  set deptorData(deptor: ICreditProposal) {
    this._deptorData = deptor;
  }
  // icon
  faSearch = faSearch;

  religiontypes: IReligionType[] = [];
  worktypes: IWorkType[] = [];
  partyTypeId: string;
  postalAddressId: number;
  religionTypeId: string;
  workTypeId: string;
  public umkmClassification: any;
  public categoryDebtor: any;
  public maritalStatusess: any;
  public genderss: any;
  public gendersss = ['Laki - Laki', 'Perempuan'];
  public collectabilityStatusData = ['1', '2', '3', '4', '5'];
  // public CollecStatus: string = 'Canada';
  public ifcRiskCategoryData = [];
  public categoryDebitur = ['70', '80', '90', '99'];
  public umkm = ['micro', 'small', 'intermediate', 'high'];
  public callReportCategoryData = [];
  public pep = [];

  constructor(
    protected productParameterService: MasterProductParameterService,
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected personService: PersonService,
    protected partyTypeService: PartyTypeService,
    protected postalAddressService: PostalAddressService,
    protected religionTypeService: ReligionTypeService,
    protected workTypeService: WorkTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    protected partyCifService: PartyCifService,
    private masterInitialDebtorDataService: MasterInitialDebtorDataService,
    public account: AccountService,
    protected generalParameterService: GeneralParameterService
  ) {
    super(personService, messageService, elementRef, dataUtils, account, eventManager);
    (this.collectabilityStatus = COLLECTABILITY_STATUS),
      (this.item = new Person()),
      (this.genderss = GENDER),
      (this.maritalStatusess = MARITAL_STATUS),
      (this.categoryDebtor = CATEGORY_DEBTOR),
      (this.umkmClassification = UMKM_CLASSIFICATION);
  }

  ngOnInit(): void {
    this.lovCallreport();
    this.getLov();
    this.lovPep();
    this.myFunction();
    this.masterInitialDebtorDataService.getMaritalStatus().subscribe((res: HttpResponse<IOptionNode[]>) => {
      this.maritalStatuses = res.body;
    });

    this.personService.getBloodTypes().subscribe((res: HttpResponse<IOptionNode[]>) => {
      this.bloodTypes = res.body;
    });

    this.personService.getGenders().subscribe((res: HttpResponse<IOptionNode[]>) => {
      this.genders = res.body;
    });
    this.hiddenNull();

    if (this._deptorData.debtorData.collectabilityStatus === null) {
      this.deptorData.debtorData.collectabilityStatus = '1';
    }
  }
  public countAge(): number {
    let age: number;
    age = 0;
    if (this.item.dob) {
      age = moment().diff(moment(this.item.dob), 'year');
    }
    return age;
  }
  public hiddenNull() {
    if (this.item.firstName === null) {
      this.item.firstName = '';
    }
    if (this.item.lastName === null) {
      this.item.lastName = '';
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
        for (let i = 0; i < this.callReportCategoryData.length; i++) {
          if (this.callReportCategoryData[i].code === this.deptorData.debtorData.callReportCategory) {
            this.callReportCategory = this.callReportCategoryData[i].value;
          }
        }
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['item']) {
      if (changes['item'].isFirstChange()) {
        this.initialize();
      }

      this.item.dob = this.item.dob != null ? new Date(this.item.dob) : null;
      if (this.item.attributes['fronTitle'] === undefined) {
        this.item.attributes['fronTitle'] = '';
      }

      if (this.item.attributes['backTitle'] === undefined) {
        this.item.attributes['backTitle'] = '';
      }

      if (this.item.attributes['identityLifetime'] === undefined) {
        this.item.attributes['identityLifetime'] = true;
      }

      if (this.item.attributes['identityExpiredDate'] === undefined) {
        this.item.attributes['identityExpiredDate'] = new Date();
      }

      if (this.item.attributes['sid'] === undefined) {
        this.item.attributes['sid'] = '';
      }

      if (this.item.attributes['sidCode'] === undefined) {
        this.item.attributes['sidCode'] = '';
      }

      if (this.item.attributes['lbuCode'] === undefined) {
        this.item.attributes['lbuCode'] = '';
      }

      if (this.item.attributes['lbuRemark'] === undefined) {
        this.item.attributes['lbuRemark'] = '';
      }
    }
    if (changes['_deptorData']) {
      console.log('Deptor data Changes', this._deptorData);
    }
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
        for (let i = 0; i < this.ifcRiskCategoryData.length; i++) {
          if (this.ifcRiskCategoryData[i].code === this.deptorData.debtorData.ifcRiskCategory) {
            this.ifcRiskCategory = this.ifcRiskCategoryData[i].value;
          }
        }
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
        this.pep = _.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public collectabilityStatus: any;

  public updateModel(): void {
    this.selectMaritalStatus.emit(_.find(this.maritalStatuses, { id: this.item.maritalStatus }));
    this.selectGenders.emit(_.find(this.genders, { id: this.item.gender }));
  }

  initialize() {
    this.religionTypeService.loadCacheAll().subscribe((res: IReligionType[]) => (this.religiontypes = res || []));
    this.workTypeService.loadCacheAll().subscribe((res: IWorkType[]) => (this.worktypes = res || []));
  }

  trackReligionTypeById(index: number, item: IReligionType) {
    return item.id;
  }

  trackWorkTypeById(index: number, item: IWorkType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }

  // umkm

  public mortCode = [];
  public getProduct(): void {
    this.productParameterService
      .filterTableData({
        idProductType: 'MORT',
        page: 0,
        // sort: this.sortData(),
        size: 9999,
      })
      .subscribe(res => {
        if (res.body.length > 0) {
          for (let i = 0; i < res.body.length; i++) {
            this.mortCode.push(res.body[i].code);
          }
          this.functionCek();
        }
      });
  }

  public totalPlafond: number;
  public functionCek() {
    // const mortCodes = [
    //   '030300001001',
    //   '030300001003',
    //   '030300001002',
    //   '030100001003',
    //   '030300001004',
    //   '030300001005',
    //   '030300002001',
    //   '030300002002',
    //   '030300002003',
    //   '030300003001',
    //   '030300004001',
    //   '030300006001',
    // ];
    if (this.deptorData.products.length > 0) {
      let element: IApplicationProduct[] = [];
      const jumlahPlafond = [];
      const data = [];
      let result: number;
      let dolar: number;
      result = 0;
      dolar = 0;

      element = this.deptorData.products.filter(products => !this.mortCode.includes(products.productCode));
      if (element.length > 0) {
        const filterUsd = element.filter(obj => obj.currencyId === 'USD');
        const filterIdr = element.filter(obj => obj.currencyId !== 'USD');
        if (filterIdr.length > 0) {
          for (let i = 0; i < filterIdr.length; i++) {
            if (filterIdr[i].totalPlafond !== undefined) {
              result = result + Number(filterIdr[i].totalPlafond);
            }
          }
        }
        if (filterUsd.length > 0) {
          for (let i = 0; i < filterUsd.length; i++) {
            if (filterUsd[i].totalPlafond !== undefined) {
              dolar = dolar + Number(filterUsd[i].totalPlafond) * Number(filterUsd[i].kurs);
            }
          }
        }
      }

      this.totalPlafond = result + dolar;

      // for (let i = 0; i < element.length; i++) {
      //   data.push(element[i].totalPlafond);
      // }
      // this.totalPlafond = data.reduce((acc, curr) => acc + curr, 0);
    }

    // if (this.parsedAttr.previousHistory) {
    // this.cc1 =  this.parsedAttr.previousHistory.products.filter(product => mortCodes.includes(product.productCode));
    // } else {
    // this.cc1 =  this.creditProposal.products.filter(product => mortCodes.includes(product.productCode));
    // }
  }

  public myFunction() {
    this.getProduct();
    if (this.deptorData.applicationTypeId === 'SME') {
      const totalPlafond = 0;

      if (this.totalPlafond <= 15000000000) {
        if (this.deptorData.capitalDeposit <= 1000000000) {
          if (this.deptorData.annualSales <= 2000000000) {
            this.deptorData.umkmClass = 'Mikro';
          }
          if (this.deptorData.annualSales > 2000000000 && this.deptorData.annualSales <= 15000000000) {
            this.deptorData.umkmClass = 'Kecil';
          }
          if (this.deptorData.annualSales > 15000000000 && this.deptorData.annualSales <= 50000000000) {
            this.deptorData.umkmClass = 'Menengah';
          }
          if (this.deptorData.annualSales > 50000000000) {
            this.deptorData.umkmClass = 'Non UMKM';
          }
        } else if (this.deptorData.capitalDeposit > 1000000000 && this.deptorData.capitalDeposit <= 5000000000) {
          if (this.deptorData.annualSales <= 2000000000) {
            this.deptorData.umkmClass = 'Kecil';
          }
          if (this.deptorData.annualSales > 2000000000 && this.deptorData.annualSales <= 15000000000) {
            this.deptorData.umkmClass = 'Kecil';
          }
          if (this.deptorData.annualSales > 2000000000 && this.deptorData.annualSales <= 15000000000) {
            this.deptorData.umkmClass = 'Kecil';
          }
          if (this.deptorData.annualSales > 15000000000 && this.deptorData.annualSales <= 50000000000) {
            this.deptorData.umkmClass = 'Menengah';
          }
          if (this.deptorData.annualSales > 50000000000) {
            this.deptorData.umkmClass = 'Non UMKM';
          }
        } else if (this.deptorData.capitalDeposit > 5000000000 && this.deptorData.capitalDeposit <= 10000000000) {
          if (this.deptorData.annualSales <= 2000000000) {
            this.deptorData.umkmClass = 'Menengah';
          }
          if (this.deptorData.annualSales > 2000000000 && this.deptorData.annualSales <= 15000000000) {
            this.deptorData.umkmClass = 'Menengah';
          }
          if (this.deptorData.annualSales > 15000000000 && this.deptorData.annualSales <= 50000000000) {
            this.deptorData.umkmClass = 'Menengah';
          }
          if (this.deptorData.annualSales > 50000000000) {
            this.deptorData.umkmClass = 'Non  UMKM';
          }
        } else if (this.deptorData.capitalDeposit > 10000000000) {
          if (this.deptorData.annualSales <= 2000000000) {
            this.deptorData.umkmClass = 'Non  UMKM';
          }
          if (this.deptorData.annualSales > 2000000000 && this.deptorData.annualSales <= 15000000000) {
            this.deptorData.umkmClass = 'Non  UMKM';
          }
          if (this.deptorData.annualSales > 15000000000 && this.deptorData.annualSales <= 50000000000) {
            this.deptorData.umkmClass = 'Non  UMKM';
          }
          if (this.deptorData.annualSales > 50000000000) {
            this.deptorData.umkmClass = 'Non  UMKM';
          }
        }
      } else {
        this.deptorData.umkmClass = 'Non UMKM';
      }
    } else {
      this.deptorData.umkmClass = 'Non UMKM';
    }

    if (this.deptorData.umkmClass !== '' || this.deptorData.umkmClass !== undefined) {
      if (this.deptorData.umkmClass === 'Mikro') {
        this.deptorData.debtorCategory = '70';
      } else if (this.deptorData.umkmClass === 'Kecil') {
        this.deptorData.debtorCategory = '80';
      } else if (this.deptorData.umkmClass === 'Menengah') {
        this.deptorData.debtorCategory = '90';
      } else {
        this.deptorData.debtorCategory = '99';
      }
    } else {
      this.deptorData.debtorCategory = '';
    }
  }

  currencyInputChanged(value: string) {
    let num: string;
    const args = value.indexOf('IDR');
    args === -1 ? (num = '0') : (num = value.replace(/[IDR,]/g, ''));
    return Number(num);
  }
}
