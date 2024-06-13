import { Component, OnChanges, SimpleChanges, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

// import { IPostalAddress, PostalAddress } from './postal-address.model';
// import { PostalAddressService } from './postal-address.service';
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
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IInternal } from '../internal.model';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

type SelectableEntity = IContactMechType | IPurposeType | IStateBoundary;

@Component({
  selector: 'jhi-internal-address-view',
  templateUrl: './internal-address-view.component.html',
  styleUrls: ['./internal-address-view.css'],
})
export class InternalAddressViewComponent extends AbstractEntityBaseViewComponent<IPostalAddress> implements OnInit, OnChanges {
  private _postalAddress: IPostalAddress;

  public changes = false;

  myControlCountry = new FormControl('');
  public optionsCountry: IStateBoundary[];
  public filteredOptionsCountry: Observable<IStateBoundary[]>;

  myControlProvince = new FormControl('');
  public optionsProvince: IStateBoundary[];
  public filteredOptionsProvince: Observable<IStateBoundary[]>;

  myControlCity = new FormControl('');
  public optionsCity: IStateBoundary[] = [];
  public filteredOptionsCity: Observable<IStateBoundary[]>;

  myControlDistrict = new FormControl('');
  public optionsDistrict: IStateBoundary[];
  public filteredOptionsDistrict: Observable<IStateBoundary[]>;

  myControlVillage = new FormControl('');
  public optionsVillage: IStateBoundary[];
  public filteredOptionsVillage: Observable<IStateBoundary[]>;

  @Input()
  get internalData() {
    return this._postalAddress;
  }

  set internalData(data: IPostalAddress) {
    this._postalAddress = data;
  }

  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  @ViewChild('listCountry')
  public listCountry: DropDownListComponent;

  public postalCode: number;
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

  public country: IStateBoundary;
  public province: IStateBoundary;
  public cities: IStateBoundary;
  public districts: IStateBoundary;
  public villages: IStateBoundary;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['internalData']) {
      console.log('internal dayta ', this.internalData);
    }
  }

  ngOnInit(): void {
    this.initializeCountry();
    this.initializeProvince();
    this.initializeCity();
    this.initializeDistrict();
    this.initializeVillage();
    this.cekDataSource();
    console.log('postal adress');
  }

  filteredCountry() {
    this.filteredOptionsCountry = this.myControlCountry.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterCountry(name as string) : this.optionsCountry.slice();
      })
    );
  }

  private _filterCountry(description: string): IStateBoundary[] {
    const filterValue = description.toLowerCase();
    return this.optionsCountry.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  displayFnCounrtry(country: IStateBoundary): string {
    return country && country.description ? country.description : '';
  }

  filteredProvince() {
    this.filteredOptionsProvince = this.myControlProvince.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterProvince(name as string) : this.optionsProvince.slice();
      })
    );
  }

  private _filterProvince(description: string): IStateBoundary[] {
    const filterValue = description.toLowerCase();
    return this.optionsProvince.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  displayFnProvince(province: IStateBoundary): string {
    return province && province.description ? province.description : '';
  }

  filteredCity() {
    this.filteredOptionsCity = this.myControlCity.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterCity(name as string) : this.optionsCity.slice();
      })
    );
  }

  private _filterCity(description: string): IStateBoundary[] {
    const filterValue = description.toLowerCase();
    return this.optionsCity.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  displayFnCity(city: IStateBoundary): string {
    return city && city.description ? city.description : '';
  }

  filteredDistrict() {
    this.filteredOptionsDistrict = this.myControlDistrict.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterDistrict(name as string) : this.optionsDistrict.slice();
      })
    );
  }

  private _filterDistrict(description: string): IStateBoundary[] {
    const filterValue = description.toLowerCase();
    return this.optionsDistrict.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  displayFnDistrict(district: IStateBoundary): string {
    return district && district.description ? district.description : '';
  }

  filteredVillage() {
    this.filteredOptionsVillage = this.myControlVillage.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filtervillage(name as string) : this.optionsVillage.slice();
      })
    );
  }

  private _filtervillage(description: string): IStateBoundary[] {
    const filterValue = description.toLowerCase();
    return this.optionsVillage.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  displayFnVillage(village: IStateBoundary): string {
    return village && village.description ? village.description : '';
  }

  // private prepareView() {
  //   if (this.postalAddress.countryId) {
  //     this.initializeProvince();
  //   }
  //   if (this.postalAddress.provinceId) {
  //     this.initializeCity();
  //   }
  //   if (this.postalAddress.cityId) {
  //     this.initializeDistrict();
  //   }
  //   if (this.postalAddress.districtId) {
  //     this.initializeVillage();
  //   }
  // }

  public initializeCity(value = false): void {
    this.stateBoundaryService
      .queryFilterBy({
        page: 0,
        size: 9999,
        idBoundaryType: GEO_BOUNDARY_TYPE['city'],
        idParent: this.internalData.provinceId,
      })
      .subscribe(res => {
        this.optionsCity = res.body;
        this.filteredCity();
        this.cities = this.optionsCity.find(obj => obj.id === this.internalData.cityId);
        if (value === true) {
          this.myControlCity.enable();
        }
      });
  }

  public initializeDistrict(value = false): void {
    this.stateBoundaryService
      .queryFilterBy({
        page: 0,
        size: 999,
        idBoundaryType: GEO_BOUNDARY_TYPE['district'],
        idParent: this.internalData.cityId,
      })
      .subscribe(res => {
        this.optionsDistrict = res.body;
        this.filteredDistrict();
        this.districts = this.optionsDistrict.find(obj => obj.id === this.internalData.districtId);
        if (value === true) {
          this.myControlDistrict.enable();
        }
      });
  }

  public initializeVillage(value = false): void {
    this.stateBoundaryService
      .queryFilterBy({ page: 0, size: 50, idBoundaryType: GEO_BOUNDARY_TYPE['village'], idParent: this.internalData.districtId })
      .subscribe(res => {
        this.optionsVillage = res.body;
        this.filteredVillage();
        this.villages = this.optionsVillage.find(obj => obj.id === this.internalData.villageId);
        if (value === true) {
          this.myControlVillage.enable();
        }
      });
  }

  public initializeProvince(value = false): void {
    console.log('province ', this.internalData.provinceId);
    this.stateBoundaryService
      .queryFilterBy({
        page: 0,
        size: 9999,
        idBoundaryType: GEO_BOUNDARY_TYPE['province'],
        idParent: this.internalData.countryId,
      })
      .subscribe(res => {
        this.optionsProvince = res.body;
        this.filteredProvince();
        if (this.country.id === 199) {
          this.province = this.optionsProvince.find(obj => obj.id === this.internalData.provinceId);
        } else {
          this.province = {
            description: 'DI LUAR INDONESIA',
            id: 384,
          };
        }
        if (value === true) {
          this.myControlCity.enable();
        }
      });
  }

  public getIdVillage() {
    this.internalData.villageId = this.villages.id;
  }

  public initializeCountry(): void {
    this.stateBoundaryService
      .queryFilterBy({
        idBoundaryType: GEO_BOUNDARY_TYPE['country'],
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.optionsCountry = res.body;
        this.filteredCountry();
        // const indonesia : IStateBoundary = res.body.find(obj => obj.id === 199 )
        // this.optionsCountry = res.body.splice()
        this.country = this.optionsCountry.find(obj => obj.id === this.internalData.countryId);
        this.initializeProvince();
      });
  }

  public getValueCountry() {
    this.internalData.countryId = this.country.id;
    this.initializeProvince();
  }

  public getValueProvince() {
    this.internalData.provinceId = this.province.id;
    this.initializeCity();
  }

  public getValueCity() {
    this.internalData.cityId = this.cities.id;
    this.initializeDistrict();
  }

  public getValueDistrict() {
    this.internalData.districtId = this.districts.id;
    this.initializeVillage();
  }

  public getValueCountryChange() {
    this.internalData.countryId = this.country.id;
    this.initializeProvince();
    this.internalData.cityId = null;
    this.internalData.districtId = null;
    this.internalData.villageId = null;
    this.initializeDistrict();
    this.initializeCity();
    this.initializeVillage();
    this.myControlProvince.enable();
    this.myControlCity.disable();
    this.myControlDistrict.disable();
    this.myControlVillage.disable();
  }

  public getValueProvinceChange() {
    this.internalData.provinceId = this.province.id;
    this.initializeCity(true);
    this.internalData.cityId = null;
    this.internalData.districtId = null;
    this.internalData.villageId = null;
    if (this.internalData.provinceId) {
      this.myControlDistrict.disable();
      this.myControlVillage.disable();
      this.initializeDistrict();
      this.initializeVillage();
    }
  }

  public getValueCityChange() {
    this.internalData.cityId = this.cities.id;
    this.initializeDistrict(true);
    if (this.internalData.cityId) {
      this.myControlCity.disable();
    }
  }

  public getValueDistrictChange() {
    this.internalData.districtId = this.districts.id;
    this.initializeVillage(true);
    if (this.internalData.districtId) {
      this.myControlDistrict.disable();
    }
  }

  // public dataSource() {
  //   if (this.type === undefined) {
  //     if (this.collateral?.dataSource === 'h' || this.collateral?.dataSource === 'H') {
  //       return true;
  //     }
  //     if (this.collateralApprAddress === true) {
  //       return true;
  //     }
  //     if (this._organization?.dataSource === 'h' || this._organization?.dataSource === 'H') {
  //       return true;
  //     }
  //   } else if (this.type === 'approval') {
  //     return true;
  //   }
  //   return false;
  // }

  public cekDataSource() {
    if (this.internalData.countryId === null) {
      this.myControlProvince.disable();
    }
    this.myControlCity.disable();
    this.myControlDistrict.disable();
    this.myControlVillage.disable();
  }

  public clickedCountry() {
    this.changes = true;
    console.log('changes ', this.changes);
  }
}
