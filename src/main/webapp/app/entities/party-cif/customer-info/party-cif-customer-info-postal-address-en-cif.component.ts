import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStateBoundary, StateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';
import { IPartyCif, PartyCif } from '../../party-cif.model';

@Component({
  selector: 'jhi-party-cif-customer-info-postal-address-en-cif',
  templateUrl: './party-cif-customer-info-postal-address-en-cif.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifCustomerInfoPostalAddressEnCifComponent
  extends AbstractEntityViewPageComponent<IPartyPostalAddress>
  implements OnInit, OnChanges
{
  public country: IStateBoundary[];
  public provinces: IStateBoundary[];
  public districts: IStateBoundary[];
  public villages: IStateBoundary[];
  public cities: IStateBoundary[];

  private _partyCif: IPartyCif = new PartyCif();
  
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(data: IPartyCif) {
    this._partyCif = data;
  }

  constructor(
    protected activatedRoute: ActivatedRoute,
    private stateBoundaryService: StateBoundaryService,
    private purposeTypeService: PurposeTypeService
  ) {
    super();
    this.country = [];
    this.provinces = [];
    this.cities = [];
    this.districts = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyPostalAddress']) {
      this.loadProvince(this.partyPostalAddress.address.countryId);
      this.loadCity(this.partyPostalAddress.address.provinceId);
      this.loadDistrict(this.partyPostalAddress.address.cityId);
      this.loadVillage(this.partyPostalAddress.address.districtId);
    }
  }

  ngOnInit(): void {
    this.loadCountry();
  }

  public findStateBoundary(id: number, param: IStateBoundary[]): IStateBoundary {
    if (param.length > 0) {
      for (let i = 0; i < param.length; i++) {
        const item: IStateBoundary = param[i];
        if (item.id === id) {
          return item;
        }
      }
    }
    return new StateBoundary();
  }

  private loadCountry(): void {
    this.stateBoundaryService
      .queryFilterBy({
        idBoundaryType: GEO_BOUNDARY_TYPE['country'],
        size: 9999,
        page: 0,
      })
      .subscribe(res => {
        this.country = res.body;
      });
  }

  public loadProvince(idCountry: number = null): void {
    if (idCountry) {
      const predicate: object = {
        idBoundaryType: GEO_BOUNDARY_TYPE['province'],
        page: 0,
        size: 9999,
        idParent: idCountry,
      };

      this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
        this.provinces = res.body;
      });
    }
  }

  public loadCity(idProvince: number = null): void {
    if (idProvince) {
      const predicate: object = {
        idBoundaryType: GEO_BOUNDARY_TYPE['city'],
        size: 9999,
        idParent: idProvince,
      };
      this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
        this.cities = res.body;
      });
    }
  }

  public loadDistrict(idCity: number = null): void {
    if (idCity) {
      const predicate: object = {
        idBoundaryType: GEO_BOUNDARY_TYPE['district'],
        size: 9999,
        idParent: idCity,
      };
      this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
        this.districts = res.body;
      });
    }
  }

  public loadVillage(idDistrict: number = null): void {
    if (idDistrict) {
      const predicate: object = {
        idBoundaryType: GEO_BOUNDARY_TYPE['village'],
        size: 9999,
        idParent: idDistrict,
      };
      this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
        this.villages = res.body;
      });
    }
  }
}
