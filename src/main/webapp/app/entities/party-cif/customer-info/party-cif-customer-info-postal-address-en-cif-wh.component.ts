import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IOrganizationManagement } from 'app/entities/organization-management/organization-management.model';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
import { IStateBoundary, StateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';
import { PURPOSE_TYPE } from 'app/shared/constants/base.constants';
import { map, Observable, startWith } from 'rxjs';
import { IPartyCif, PartyCif } from '../party-cif.model';

@Component({
  selector: 'jhi-party-cif-customer-info-postal-address-en-cif-wh',
  templateUrl: './party-cif-customer-info-postal-address-en-cif-wh.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifCustomerInfoPostalAddressEnCifWhComponent implements OnInit {
  private _partyCif: IPartyCif = new PartyCif();
  public index: number;
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
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(data: IPartyCif) {
    this._partyCif = data;

    this.index = this.partyCif.addresses.findIndex(obj => obj.purposeTypeId === PURPOSE_TYPE.WAREHOUSE);
  }

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
    this.initializeCity();
    this.initializeDistrict();
    this.initializeVillage();
    this.cekDataSource();
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
        idParent: this._partyCif.addresses[this.index].address.provinceId,
      })
      .subscribe(res => {
        this.optionsCity = res.body;
        this.filteredCity();
        this.cities = this.optionsCity.find(obj => obj.id === this._partyCif.addresses[this.index].address.cityId);
        if (value === true) {
          this.myControlCity.enable();
        }
      });
  }

  public initializeDistrict(value = false): void {
    this.stateBoundaryService
      .queryFilterBy({
        page: 0,
        size: 9999,
        idBoundaryType: GEO_BOUNDARY_TYPE['district'],
        idParent: this._partyCif.addresses[this.index].address.cityId,
      })
      .subscribe(res => {
        this.optionsDistrict = res.body;
        this.filteredDistrict();
        this.districts = this.optionsDistrict.find(obj => obj.id === this._partyCif.addresses[this.index].address.districtId);
        if (value === true) {
          this.myControlDistrict.enable();
        }
      });
  }

  public initializeVillage(value = false): void {
    this.stateBoundaryService
      .queryFilterBy({
        page: 0,
        size: 50,
        idBoundaryType: GEO_BOUNDARY_TYPE['village'],
        // idParent: this.postalAddress.districtId
        idParent: this._partyCif.addresses[this.index].address.districtId,
      })
      .subscribe(res => {
        this.optionsVillage = res.body;
        this.filteredVillage();
        this.villages = this.optionsVillage.find(obj => obj.id === this._partyCif.addresses[this.index].address.villageId);
        // this.villages = this.optionsVillage.find(obj => obj.id === this.postalAddress.villageId);
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
        idParent: this._partyCif.addresses[this.index].address.countryId,
      })
      .subscribe(res => {
        this.optionsProvince = res.body;
        this.filteredProvince();
        if (this.country.id === 199) {
          this.province = this.optionsProvince.find(obj => obj.id === this._partyCif.addresses[this.index].address.provinceId);
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
    this._partyCif.addresses[this.index].address.villageId = this.villages.id;
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
        // this.country = this.optionsCountry.find(obj => obj.id === this.postalAddress.countryId);
        this.country = this.optionsCountry.find(obj => obj.id === this._partyCif.addresses[this.index].address.countryId);
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
    this._partyCif.addresses[this.index].address.countryId = this.country.id;
    this.initializeProvince();
    this._partyCif.addresses[this.index].address.cityId = null;
    this._partyCif.addresses[this.index].address.districtId = null;
    this._partyCif.addresses[this.index].address.villageId = null;
    this.initializeDistrict();
    this.initializeCity();
    this.initializeVillage();
    this.myControlProvince.enable();
    this.myControlCity.disable();
    this.myControlDistrict.disable();
    this.myControlVillage.disable();
  }

  public getValueProvinceChange() {
    this._partyCif.addresses[this.index].address.provinceId = this.province.id;
    this.initializeCity();
    this._partyCif.addresses[this.index].address.cityId = null;
    this._partyCif.addresses[this.index].address.districtId = null;
    this._partyCif.addresses[this.index].address.villageId = null;
    if (this._partyCif.addresses[this.index].address.provinceId) {
      this.myControlCity.enable();
      this.myControlDistrict.disable();
      this.myControlVillage.disable();
      this.initializeDistrict();
      this.initializeVillage();
    }
  }

  public getValueCityChange() {
    this._partyCif.addresses[this.index].address.cityId = this.cities.id;
    this.initializeDistrict();
    if (this._partyCif.addresses[this.index].address.cityId) {
      this.myControlCity.disable();
      this.myControlDistrict.enable();
    }
  }

  public getValueDistrictChange() {
    this._partyCif.addresses[this.index].address.districtId = this.districts.id;
    this.initializeVillage();
    if (this._partyCif.addresses[this.index].address.districtId) {
      this.myControlDistrict.disable();
      this.myControlVillage.enable();
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

  public findNameState(data: IStateBoundary) {
    if (data) {
      if (data.description) {
        return data.description;
      }
    }
    return '';
  }

  // public country: IStateBoundary[];
  // public provinces: IStateBoundary[];
  // public districts: IStateBoundary[];
  // public villages: IStateBoundary[];
  // public cities: IStateBoundary[];

  // private _partyCif: IPartyCif = new PartyCif();

  // public index: number;
  // myControlProvince = new FormControl('');

  // @Input()
  // get partyCif() {
  //   return this._partyCif;
  // }

  // set partyCif(data: IPartyCif) {
  //   this._partyCif = data;

  //   this.index = this.partyCif.addresses.findIndex(obj => obj.purposeTypeId === PURPOSE_TYPE.WAREHOUSE);
  //   this.loadProvince(this._partyCif.addresses[this.index].address.countryId);
  //   this.loadCity(this._partyCif.addresses[this.index].address.provinceId);
  //   this.loadDistrict(this._partyCif.addresses[this.index].address.cityId);
  //   this.loadVillage(this._partyCif.addresses[this.index].address.districtId);
  // }

  // constructor(protected activatedRoute: ActivatedRoute, private stateBoundaryService: StateBoundaryService) {
  //   this.country = [];
  //   this.provinces = [];
  //   this.cities = [];
  //   this.districts = [];
  // }

  // ngOnInit(): void {
  //   this.loadCountry();
  // }

  // public findStateBoundary(id: number, param: IStateBoundary[]): IStateBoundary {
  //   if (param.length > 0) {
  //     for (let i = 0; i < param.length; i++) {
  //       const item: IStateBoundary = param[i];
  //       if (item.id === id) {
  //         return item;
  //       }
  //     }
  //   }
  //   return new StateBoundary();
  // }

  // private loadCountry(): void {
  //   this.stateBoundaryService
  //     .queryFilterBy({
  //       idBoundaryType: GEO_BOUNDARY_TYPE['country'],
  //       size: 9999,
  //       page: 0,
  //     })
  //     .subscribe(res => {
  //       this.country = res.body;
  //     });
  // }

  // public loadProvince(idCountry: number = null): void {
  //   if (idCountry === 199) {
  //     const predicate: object = {
  //       idBoundaryType: GEO_BOUNDARY_TYPE['province'],
  //       page: 0,
  //       size: 9999,
  //       idParent: idCountry,
  //     };

  //     this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
  //       this.provinces = res.body;
  //     });
  //   } else if (idCountry !== 199) {
  //     const predicate: object = {
  //       idBoundaryType: GEO_BOUNDARY_TYPE['province'],
  //       page: 0,
  //       size: 9999,
  //       // idParent: 201,
  //     };

  //     this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
  //       const dataData = res.body;
  //       this.provinces = dataData.filter(o => o.code === '99');
  //       // ini untuk sementara
  //     });
  //   }
  // }

  // public loadCity(idProvince: number = null): void {
  //   if (idProvince) {
  //     const predicate: object = {
  //       idBoundaryType: GEO_BOUNDARY_TYPE['city'],
  //       size: 9999,
  //       idParent: idProvince,
  //     };
  //     this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
  //       this.cities = res.body;
  //     });
  //   }
  // }

  // public loadDistrict(idCity: number = null): void {
  //   if (idCity) {
  //     const predicate: object = {
  //       idBoundaryType: GEO_BOUNDARY_TYPE['district'],
  //       size: 9999,
  //       idParent: idCity,
  //     };
  //     this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
  //       this.districts = res.body;
  //     });
  //   }
  // }

  // public loadVillage(idDistrict: number = null): void {
  //   if (idDistrict) {
  //     const predicate: object = {
  //       idBoundaryType: GEO_BOUNDARY_TYPE['village'],
  //       size: 9999,
  //       idParent: idDistrict,
  //     };
  //     this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
  //       this.villages = res.body;
  //     });
  //   }
  // }
}
