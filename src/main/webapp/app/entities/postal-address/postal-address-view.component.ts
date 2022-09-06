import { Component, OnChanges, SimpleChanges, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPostalAddress, PostalAddress } from './postal-address.model';
import { PostalAddressService } from './postal-address.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE, GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IContactMechType, ContactMechType } from 'app/entities/contact-mech-type/contact-mech-type.model';
import { ContactMechTypeService } from 'app/entities/contact-mech-type/contact-mech-type.service';
import { IPurposeType, PurposeType } from 'app/entities/purpose-type/purpose-type.model';
import { PurposeTypeService } from 'app/entities/purpose-type/purpose-type.service';
import { IStateBoundary, StateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';

type SelectableEntity = IContactMechType | IPurposeType | IStateBoundary;

@Component({
  selector: 'jhi-postal-address-view',
  templateUrl: './postal-address-view.component.html',
  styleUrls: ['./postal-address.css'],
})
export class PostalAddressViewComponent extends AbstractEntityBaseViewComponent<IPostalAddress> implements OnChanges, OnInit {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  @ViewChild('listCountry')
  public listCountry: DropDownListComponent;

  public postalCode: number;

  public country: IStateBoundary[] = new Array<IStateBoundary>();
  public province: IStateBoundary[] = new Array<IStateBoundary>();
  public cities: IStateBoundary[] = new Array<IStateBoundary>();
  public districts: IStateBoundary[] = new Array<IStateBoundary>();
  public villages: IStateBoundary[] = new Array<IStateBoundary>();
  public stateBoundaryFields: Object = { text: 'description', value: 'id' };

  contactmechtypes: IContactMechType[] = [];

  purposetypes: IPurposeType[] = [];

  stateboundaries: IStateBoundary[] = [];
  contactTypeId: string;
  countryItems: IStateBoundary[] = [];
  countrySelect: IStateBoundary;
  countryId: number;
  provinceItems: IStateBoundary[] = [];
  provinceSelect: IStateBoundary;
  provinceId: number;
  cityItems: IStateBoundary[] = [];
  citySelect: IStateBoundary;
  cityId: number;
  districtItems: IStateBoundary[] = [];
  districtSelect: IStateBoundary;
  districtId: number;
  villageItems: IStateBoundary[] = [];
  villageSelect: IStateBoundary;
  villageId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected postalAddressService: PostalAddressService,
    protected contactMechTypeService: ContactMechTypeService,
    protected purposeTypeService: PurposeTypeService,
    protected stateBoundaryService: StateBoundaryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(postalAddressService, messageService, elementRef, dataUtils, account, eventManager);
    this.countrySelect = new StateBoundary();
    this.provinceSelect = new StateBoundary();
    this.citySelect = new StateBoundary();
    this.districtSelect = new StateBoundary();
    this.villageSelect = new StateBoundary();
    this.item = new PostalAddress();
  }

  ngOnInit(): void {
    this.initializeCountry();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PostalAddress();
        this.postalAddressService.find(this.id).subscribe(result => {
          this.item = result.body;
          this.prepareView();
        });
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

  initialize() {
    this.contactMechTypeService.loadCacheAll().subscribe((res: IContactMechType[]) => (this.contactmechtypes = res || []));

    this.purposeTypeService.loadCacheAll().subscribe((res: IPurposeType[]) => (this.purposetypes = res || []));

    this.stateBoundaryService.loadCacheAll().subscribe((res: IStateBoundary[]) => (this.stateboundaries = res || []));
  }

  private initializeCountry(): void {
    this.stateBoundaryService
      .queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['country'] })
      .subscribe((res: HttpResponse<IStateBoundary[]>) => {
        this.country = res.body;
      });
  }

  private initializeProvince(parentId: Number): void {
    this.stateBoundaryService
      .queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['province'], idParent: parentId })
      .subscribe((res: HttpResponse<IStateBoundary[]>) => {
        this.province = res.body;
      });
  }

  private initializeCity(parentId: Number): void {
    this.stateBoundaryService
      .queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['city'], idParent: parentId })
      .subscribe((res: HttpResponse<IStateBoundary[]>) => {
        this.cities = res.body;
        console.log('city', res.body);
      });
  }

  private initializeDistrict(parentId: Number): void {
    this.stateBoundaryService
      .queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['district'], idParent: parentId })
      .subscribe((res: HttpResponse<IStateBoundary[]>) => {
        this.districts = res.body;
      });
  }

  private initializeVillage(parentId: Number): void {
    this.stateBoundaryService
      .queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['city'], idParent: parentId })
      .subscribe((res: HttpResponse<IStateBoundary[]>) => {
        this.villages = res.body;
      });
  }

  selectCountry(args: any) {
    const selectedCountry: IStateBoundary = args['itemData'];
    this.item.countryId = selectedCountry.id;
    this.initializeProvince(selectedCountry.id);
  }

  selectProvince(args: any) {
    const selectedProvince: IStateBoundary = args['itemData'];
    this.item.provinceId = selectedProvince.id;
    this.initializeCity(selectedProvince.id);
  }

  selectCity(args: any) {
    const selectedCity: IStateBoundary = args['itemData'];
    this.item.cityId = selectedCity.id;
    this.initializeDistrict(selectedCity.id);
  }

  selectDistrict(args: any) {
    const selectedDistrict: IStateBoundary = args['itemData'];
    this.item.districtId = selectedDistrict.id;
  }

  selectVillage(args: any) {
    const selectedvillage: IStateBoundary = args['itemData'];
    this.item.villageId = selectedvillage.id;
    this.initializeVillage(selectedvillage.id);
  }
  // ------------------------------------------------------------------------
  prepareView() {
    if (this.postalAddress.countryId) {
      this.initializeProvince(this.postalAddress.countryId);
    }
    if (this.postalAddress.provinceId) {
      this.initializeCity(this.postalAddress.provinceId);
    }
    if (this.postalAddress.cityId) {
      this.initializeDistrict(this.postalAddress.cityId);
    }

    if (this.postalAddress.villageId) {
      this.initializeVillage(this.postalAddress.villageId);
    }
  }

  get postalAddress() {
    return this.item;
  }

  set postalAddress(postalAddress: IPostalAddress) {
    this.item = postalAddress;
  }

  trackContactMechTypeById(index: number, item: IContactMechType) {
    return item.id;
  }

  trackPurposeTypeById(index: number, item: IPurposeType) {
    return item.id;
  }

  searchcountry(event: any) {
    this.stateBoundaryService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IStateBoundary[]>) => {
      this.countryItems = res.body;
    });
  }

  searchprovince(event: any) {
    this.stateBoundaryService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IStateBoundary[]>) => {
      this.provinceItems = res.body;
    });
  }

  selectprovince(value: any) {
    this.item.provinceId = this.provinceSelect.id;
  }

  searchcity(event: any) {
    this.stateBoundaryService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IStateBoundary[]>) => {
      this.cityItems = res.body;
    });
  }

  selectcity(value: any) {
    this.item.cityId = this.citySelect.id;
  }

  searchdistrict(event: any) {
    this.stateBoundaryService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IStateBoundary[]>) => {
      this.districtItems = res.body;
    });
  }

  selectdistrict(value: any) {
    this.item.districtId = this.districtSelect.id;
  }

  searchvillage(event: any) {
    this.stateBoundaryService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IStateBoundary[]>) => {
      this.villageItems = res.body;
    });
  }

  itemKey() {
    return this.item.id;
  }

  getSelected(selectedVals: IPurposeType[], option: IPurposeType): IPurposeType {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
