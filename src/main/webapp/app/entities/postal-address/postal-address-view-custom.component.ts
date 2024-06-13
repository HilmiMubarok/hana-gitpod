import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';
import { map, Observable, startWith } from 'rxjs';
import { ICollateral } from '../collateral/collateral.model';
import { IOrganizationManagement } from '../organization-management/organization-management.model';
import { IStateBoundary, StateBoundary } from '../state-boundary/state-boundary.model';
import { StateBoundaryService } from '../state-boundary/state-boundary.service';
import { IPostalAddress } from './postal-address.model';

@Component({
  selector: 'jhi-postal-address-view-custom',
  templateUrl: './postal-address-view-custom.component.html',
  styleUrls: ['./postal-address.css'],
})
export class PostalAddressViewCustomComponent implements OnInit {
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

  private _postalAddress: IPostalAddress;
  private _organization: IOrganizationManagement;

  @Input() public type: string;

  @Input()
  get postalAddress(): IPostalAddress {
    return this._postalAddress;
  }
  set postalAddress(param: IPostalAddress) {
    this._postalAddress = param;
  }

  @Input()
  get organization(): IOrganizationManagement {
    return this._postalAddress;
  }
  set organization(param: IOrganizationManagement) {
    this._organization = param;
  }

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(item: ICollateral) {
    this._collateral = item;
  }
  @Input()
  public collateralApprAddress: Boolean = false;

  private _collateral: ICollateral;
  public country: IStateBoundary;
  public province: IStateBoundary;
  public cities: IStateBoundary;
  public districts: IStateBoundary;
  public villages: IStateBoundary;

  constructor(private stateBoundaryService: StateBoundaryService) {}

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

  private prepareView() {
    if (this.postalAddress.countryId) {
      this.initializeProvince();
    }
    if (this.postalAddress.provinceId) {
      this.initializeCity();
    }
    if (this.postalAddress.cityId) {
      this.initializeDistrict();
    }
    if (this.postalAddress.districtId) {
      this.initializeVillage();
    }
  }

  public initializeCity(value = false): void {
    this.stateBoundaryService
      .queryFilterBy({
        page: 0,
        size: 9999,
        idBoundaryType: GEO_BOUNDARY_TYPE['city'],
        idParent: this.postalAddress.provinceId,
      })
      .subscribe(res => {
        this.optionsCity = res.body;
        this.filteredCity();
        this.cities = this.optionsCity.find(obj => obj.id === this.postalAddress.cityId);
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
        idParent: this.postalAddress.cityId,
      })
      .subscribe(res => {
        this.optionsDistrict = res.body;
        this.filteredDistrict();
        this.districts = this.optionsDistrict.find(obj => obj.id === this.postalAddress.districtId);
        if (value === true) {
          this.myControlDistrict.enable();
        }
      });
  }

  public initializeVillage(value = false): void {
    this.stateBoundaryService
      .queryFilterBy({ page: 0, size: 50, idBoundaryType: GEO_BOUNDARY_TYPE['village'], idParent: this.postalAddress.districtId })
      .subscribe(res => {
        this.optionsVillage = res.body;
        this.filteredVillage();
        this.villages = this.optionsVillage.find(obj => obj.id === this.postalAddress.villageId);
        if (value === true) {
          this.myControlVillage.enable();
        }
      });
  }

  public initializeProvince(value = false): void {
    this.stateBoundaryService
      .queryFilterBy({
        page: 0,
        size: 9999,
        idBoundaryType: GEO_BOUNDARY_TYPE['province'],
        idParent: this.postalAddress.countryId,
      })
      .subscribe(res => {
        this.optionsProvince = res.body;
        this.filteredProvince();
        if (this.country.id === 199) {
          this.province = this.optionsProvince.find(obj => obj.id === this.postalAddress.provinceId);
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
    this.postalAddress.villageId = this.villages.id;
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
        this.country = this.optionsCountry.find(obj => obj.id === this.postalAddress.countryId);
        this.initializeProvince();
      });
  }

  public getValueCountry() {
    this.postalAddress.countryId = this.country.id;
    this.initializeProvince();
  }

  public getValueProvince() {
    this.postalAddress.provinceId = this.province.id;
    this.initializeCity();
  }

  public getValueCity() {
    this.postalAddress.cityId = this.cities.id;
    this.initializeDistrict();
  }

  public getValueDistrict() {
    this.postalAddress.districtId = this.districts.id;
    this.initializeVillage();
  }

  public getValueCountryChange() {
    this.postalAddress.countryId = this.country.id;
    this.initializeProvince();
    this.postalAddress.cityId = null;
    this.postalAddress.districtId = null;
    this.postalAddress.villageId = null;
    this.initializeDistrict();
    this.initializeCity();
    this.initializeVillage();
    this.myControlProvince.enable();
    this.myControlCity.disable();
    this.myControlDistrict.disable();
    this.myControlVillage.disable();
  }

  public getValueProvinceChange() {
    this.postalAddress.provinceId = this.province.id;
    this.initializeCity(true);
    this.postalAddress.cityId = null;
    this.postalAddress.districtId = null;
    this.postalAddress.villageId = null;
    if (this.postalAddress.provinceId) {
      this.myControlDistrict.disable();
      this.myControlVillage.disable();
      this.initializeDistrict();
      this.initializeVillage();
    }
  }

  public getValueCityChange() {
    this.postalAddress.cityId = this.cities.id;
    this.initializeDistrict(true);
    if (this.postalAddress.cityId) {
      this.myControlCity.disable();
    }
  }

  public getValueDistrictChange() {
    this.postalAddress.districtId = this.districts.id;
    this.initializeVillage(true);
    if (this.postalAddress.districtId) {
      this.myControlDistrict.disable();
    }
  }

  public dataSource() {
    if (this.type === undefined) {
      if (this.collateral?.dataSource === 'h' || this.collateral?.dataSource === 'H') {
        return true;
      }
      if (this.collateralApprAddress === true) {
        return true;
      }
      if (this._organization?.dataSource === 'h' || this._organization?.dataSource === 'H') {
        return true;
      }
    } else if (this.type === 'approval') {
      return true;
    }
    return false;
  }

  public cekDataSource() {
    if (this.collateral?.dataSource === 'h' || this.collateral?.dataSource === 'H') {
      this.myControlCountry.disable();
      this.myControlProvince.disable();
      this.myControlCity.disable();
      this.myControlDistrict.disable();
      this.myControlVillage.disable();
    } else {
      if (this.postalAddress.countryId === null) {
        this.myControlProvince.disable();
      }
      this.myControlCity.disable();
      this.myControlDistrict.disable();
      this.myControlVillage.disable();
    }
    if (this._organization?.dataSource === 'h' || this._organization?.dataSource === 'H') {
      this.myControlCountry.disable();
      this.myControlProvince.disable();
      this.myControlCity.disable();
      this.myControlDistrict.disable();
      this.myControlVillage.disable();
    }
    if (this.collateralApprAddress === true) {
      this.myControlCountry.disable();
      this.myControlProvince.disable();
      this.myControlCity.disable();
      this.myControlDistrict.disable();
      this.myControlVillage.disable();
    }
    if (this.type === 'approval') {
      this.myControlCountry.disable();
      this.myControlProvince.disable();
      this.myControlCity.disable();
      this.myControlDistrict.disable();
      this.myControlVillage.disable();
    }
  }

  public clickedCountry() {
    this.changes = true;
    console.log('changes ', this.changes);
  }
}
