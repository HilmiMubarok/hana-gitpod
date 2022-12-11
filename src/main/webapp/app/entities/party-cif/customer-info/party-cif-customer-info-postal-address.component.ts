import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPartyPostalAddress, PartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { IPurposeType } from 'app/entities/purpose-type/purpose-type.model';
import { PurposeTypeService } from 'app/entities/purpose-type/purpose-type.service';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';

@Component({
  selector: 'jhi-party-cif-customer-info-postal-address',
  templateUrl: './party-cif-customer-info-postal-address.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifCustomerInfoPostalAddressComponent
  extends AbstractEntityViewPageComponent<IPartyPostalAddress>
  implements OnInit, OnChanges
{
  public country: IStateBoundary[];
  public provinces: IStateBoundary[];
  public districts: IStateBoundary[];
  public villages: IStateBoundary[];
  public cities: IStateBoundary[];
  public purposeTypes: IPurposeType[];
  public _domicileAddress: IPartyPostalAddress;

  private _partyPostalAddresses = new PartyPostalAddress();

  public postalAdress: IPartyPostalAddress;
  public generalLocation: IPartyPostalAddress;

  @Input() isWarehouse: Boolean = false;

  @Input()
  get partyPostalAddress() {
    return this._partyPostalAddresses;
  }

  set partyPostalAddress(data: IPartyPostalAddress) {
    this._partyPostalAddresses = data;
  }

  constructor(
    protected activatedRoute: ActivatedRoute,
    private stateBoundaryService: StateBoundaryService,
    private purposeTypeService: PurposeTypeService
  ) {
    super();
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
    this.loadPurposeType();
    this.loadCountry();
  }

  private loadPurposeType(): void {
    this.purposeTypeService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.purposeTypes = res.body;
      });
  }

  private loadCountry(): void {
    this.stateBoundaryService
      .queryFilterBy({
        idBoundaryType: GEO_BOUNDARY_TYPE['country'],
        size: 9999,
      })
      .subscribe(res => {
        this.country = res.body;
      });
  }

  private loadProvince(idCountry: number = null): void {
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

  private loadCity(idProvince: number = null): void {
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

  private loadDistrict(idCity: number = null): void {
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

  private loadVillage(idDistrict: number = null): void {
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
