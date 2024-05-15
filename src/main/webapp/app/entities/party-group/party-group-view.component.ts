import { Component, OnChanges, SimpleChanges, ElementRef, Input, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPartyGroup, PartyGroup } from './party-group.model';
import { PartyGroupService } from './party-group.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyType, PartyType } from 'app/entities/party-type/party-type.model';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { IPartyCif, PartyCif } from '../party-cif/party-cif.model';
import { GeneralParameterService } from '../master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
import { MasterProductParameterService } from '../master-parameter/master-product/master-product-parameter.service';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { IApplicationProduct } from '../application-product/application-product.model';
import { MasterCompanyTypeService } from '../master-parameter/master-company-type/master-company-type.service';
import { firstValueFrom } from 'rxjs';

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

type SelectableEntity = IPartyType | IPostalAddress;

@Component({
  selector: 'jhi-party-group-view',
  templateUrl: './party-group-view.component.html',
  styleUrls: ['./party-group-view.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PartyGroupViewComponent extends AbstractEntityBaseViewComponent<ICreditProposal> implements OnChanges, OnInit, AfterViewInit {
  public partyGroupModel: IPartyGroup = new PartyGroup();
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;
  public ifcRiskCategoryData = [];
  public callReportCategoryData = [];
  public pacth: any;
  public view: boolean;
  public partyCif: IPartyCif = new PartyCif();
  creditType = [];
  creditTypeValue: any;
  golongan = [];
  golonganValue: any;
  partytypes: IPartyType[] = [];

  moment = _rollupMoment || _moment;

  date = new FormControl(moment());

  public corpOprDivs: object[] = [
    {
      id: 'corp-opr-div-1',
      description: 'Corp Opr Div 1',
    },
    {
      id: 'line-of-business-1',
      description: 'Line Of Business 1',
    },
    {
      id: 'line-of-business-1',
      description: 'Line Of Business 1',
    },
    {
      id: 'line-of-business-1',
      description: 'Line Of Business 1',
    },
    {
      id: 'line-of-business-1',
      description: 'Line Of Business 1',
    },
  ];

  public lineOfBusiness: object[] = [
    {
      id: 'line-of-business-1',
      description: 'Line Of Business 1',
    },
    {
      id: 'line-of-business-2',
      description: 'Line Of Business 2',
    },
    {
      id: 'line-of-business-3',
      description: 'Line Of Business 3',
    },
    {
      id: 'line-of-business-4',
      description: 'Line Of Business 4',
    },
    {
      id: 'line-of-business-5',
      description: 'Line Of Business 5',
    },
  ];

  public businessTypes: object[] = [
    {
      id: 'CV',
      description: 'CV',
    },
    {
      id: 'PT',
      description: 'PT',
    },
  ];

  public identities: object[] = [
    {
      id: 'identity-1',
      description: 'Identity 1',
    },
    {
      id: 'identity-2',
      description: 'Identity 2',
    },
    {
      id: 'identity-3',
      description: 'Identity 3',
    },
    {
      id: 'identity-4',
      description: 'Identity 4',
    },
    {
      id: 'identity-5',
      description: 'Identity 5',
    },
  ];

  public peps: object[] = [
    {
      id: 'pep-1',
      description: 'PEP 1',
    },
    {
      id: 'pep-2',
      description: 'PEP 2',
    },
    {
      id: 'pep-3',
      description: 'PEP 3',
    },
    {
      id: 'pep-4',
      description: 'PEP 4',
    },
    {
      id: 'pep-5',
      description: 'PEP 5',
    },
  ];

  public riskProfiles: object[] = [
    {
      id: 'risk-profile-1',
      description: 'Risk Profile 1',
    },
    {
      id: 'risk-profile-2',
      description: 'Risk Profile 2',
    },
    {
      id: 'risk-profile-3',
      description: 'Risk Profile 3',
    },
    {
      id: 'risk-profile-4',
      description: 'Risk Profile 4',
    },
    {
      id: 'risk-profile-5',
      description: 'Risk Profile 5',
    },
  ];

  postaladdresses: IPostalAddress[] = [];
  partyTypeId: string;
  postalAddressId: number;

  constructor(
    protected productParameterService: MasterProductParameterService,
    protected dataUtils: BaseDataUtils,
    private router: Router,
    protected alertService: AlertService,
    protected partyGroupService: PartyGroupService,
    protected partyTypeService: PartyTypeService,
    protected postalAddressService: PostalAddressService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService,
    protected generalParameterService: GeneralParameterService,
    protected creditProposalService: CreditProposalService,
    protected masterCompanyTypeService: MasterCompanyTypeService
  ) {
    super(creditProposalService, messageService, elementRef, dataUtils, account, eventManager);
    this.lovCallreport();
    this.getLov();
    this.getCompanyType();
    this.loadGolongan();
    this.loadCreditType();
  }

  ngOnInit(): void {
    this.myFunction();
  }

  ngAfterViewInit(): void {
    this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
    }

    if (changes['item']) {
      if (changes['item'].isFirstChange()) {
        this.initialize();
      }
      if (this.item) {
        this.prepareView();
      }
    }

    if (changes['isSaving'] && this.item.id) {
      if (this.isSaving) {
        this.save();
      }
    }
  }

  public callReportCategoryValue: string;
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

  public ifcRiskCategoryValue: string;
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

  initialize() {
    this.postalAddressService.loadCacheAll().subscribe((res: IPostalAddress[]) => (this.postaladdresses = res || []));
  }

  prepareView() {}

  trackPartyTypeById(index: number, item: IPartyType) {
    return item.id;
  }

  trackPostalAddressById(index: number, item: IPostalAddress) {
    return item.id;
  }

  public data: string[] = ['Snooker', 'Tennis', 'Cricket', 'Football', 'Rugby'];

  public collectabilityStatusData = ['1', '2', '3', '4', '5'];
  itemKey() {
    return this.item.id;
  }

  printing() {}
  public remove() {
    this.pacth = this.router.url.split('/')[1];
    if (
      this.pacth === 'cp-status-approval' ||
      this.pacth === 'la-approval-inquiry' ||
      this.pacth === 'la-approval' ||
      this.pacth === 'la-SME-CRC'
    ) {
      this.view = true;
    }
  }

  // umkm

  public mortCode = [];
  public getProduct(): void {
    this.productParameterService
      .filterTableData({
        idProductType: 'MORT',
        page: 0,
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
    if (this.item.products.length > 0) {
      let element: IApplicationProduct[] = [];
      const jumlahPlafond = [];
      const data = [];
      let result: number;
      let dolar: number;
      result = 0;
      dolar = 0;

      element = this.item.products.filter(products => !this.mortCode.includes(products.productCode));
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
    }
  }

  public logoCcy;
  public async myFunction(): Promise<void> {
    if (this.item.annualSales === 0) {
      this.logoCcy = { prefix: 'IDR', thousands: '.', decimal: ',', precision: 0 };
    }
    // this.getProduct();
    const arrTmp = (
      await firstValueFrom(
        this.productParameterService.filterTableData({
          idProductType: 'MORT',
          page: 0,
          size: 9999,
        })
      )
    ).body;
    if (arrTmp.length > 0) {
      for (let i = 0; i < arrTmp.length; i++) {
        this.mortCode.push(arrTmp[i].code);
      }
      this.functionCek();
    }
    if (this.item.applicationTypeId === 'SME') {
      const totalPlafond = 0;

      if (this.totalPlafond <= 15000000000) {
        if (this.item.capitalDeposit <= 1000000000) {
          if (this.item.annualSales <= 2000000000) {
            this.item.umkmClass = 'Mikro';
          }
          if (this.item.annualSales > 2000000000 && this.item.annualSales <= 15000000000) {
            this.item.umkmClass = 'Kecil';
          }
          if (this.item.annualSales > 15000000000 && this.item.annualSales <= 50000000000) {
            this.item.umkmClass = 'Menengah';
          }
          if (this.item.annualSales > 50000000000) {
            this.item.umkmClass = 'Non UMKM';
          }
        } else if (this.item.capitalDeposit > 1000000000 && this.item.capitalDeposit <= 5000000000) {
          if (this.item.annualSales <= 2000000000) {
            this.item.umkmClass = 'Kecil';
          }
          if (this.item.annualSales > 2000000000 && this.item.annualSales <= 15000000000) {
            this.item.umkmClass = 'Kecil';
          }
          if (this.item.annualSales > 2000000000 && this.item.annualSales <= 15000000000) {
            this.item.umkmClass = 'Kecil';
          }
          if (this.item.annualSales > 15000000000 && this.item.annualSales <= 50000000000) {
            this.item.umkmClass = 'Menengah';
          }
          if (this.item.annualSales > 50000000000) {
            this.item.umkmClass = 'Non UMKM';
          }
        } else if (this.item.capitalDeposit > 5000000000 && this.item.capitalDeposit <= 10000000000) {
          if (this.item.annualSales <= 2000000000) {
            this.item.umkmClass = 'Menengah';
          }
          if (this.item.annualSales > 2000000000 && this.item.annualSales <= 15000000000) {
            this.item.umkmClass = 'Menengah';
          }
          if (this.item.annualSales > 15000000000 && this.item.annualSales <= 50000000000) {
            this.item.umkmClass = 'Menengah';
          }
          if (this.item.annualSales > 50000000000) {
            this.item.umkmClass = 'Non  UMKM';
          }
        } else if (this.item.capitalDeposit > 10000000000) {
          if (this.item.annualSales <= 2000000000) {
            this.item.umkmClass = 'Non  UMKM';
          }
          if (this.item.annualSales > 2000000000 && this.item.annualSales <= 15000000000) {
            this.item.umkmClass = 'Non  UMKM';
          }
          if (this.item.annualSales > 15000000000 && this.item.annualSales <= 50000000000) {
            this.item.umkmClass = 'Non  UMKM';
          }
          if (this.item.annualSales > 50000000000) {
            this.item.umkmClass = 'Non  UMKM';
          }
        }
      } else {
        this.item.umkmClass = 'Non UMKM';
      }
    } else {
      this.item.umkmClass = 'Non UMKM';
    }

    if (this.item.umkmClass !== '' || this.item.umkmClass !== undefined) {
      if (this.item.umkmClass === 'Mikro') {
        this.item.debtorCategory = '70';
      } else if (this.item.umkmClass === 'Kecil') {
        this.item.debtorCategory = '80';
      } else if (this.item.umkmClass === 'Menengah') {
        this.item.debtorCategory = '90';
      } else {
        this.item.debtorCategory = '99';
      }
    } else {
      this.item.debtorCategory = '';
    }
  }

  currencyInputChanged(value) {
    let num: string;
    const args = value.indexOf('IDR');
    args === -1 ? (num = '0') : (num = value.replace(/[IDR,]/g, ''));
    return Number(num);
  }

  public companyTypeData: any;
  companyTypeValue;
  public getCompanyType() {
    this.masterCompanyTypeService
      .query({
        // idParameterType: 'PROPOSAL_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.companyTypeData = res.body;
        if (this.companyTypeData) {
          let element: string;
          for (let i = 0; i < this.companyTypeData.length; i++) {
            if (this.item.prospectOrganization.companyType === this.companyTypeData[i].code) {
              element = this.companyTypeData[i].name;
            }
          }
          this.companyTypeValue = element;
          //  this.partyGroup.companyType =
        }
      });
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
          if (this.creditType[i].code === this.item.debtorData.creditType) {
            this.creditTypeValue = this.creditType[i].value;
          }
        }
      });
  }
  private loadGolongan(): void {
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
        for (let i = 0; i < this.creditType.length; i++) {
          if (this.golongan[i].code === this.item.debtorData.golongan) {
            this.golonganValue = this.golongan[i].value;
          }
        }
      });
  }
}
