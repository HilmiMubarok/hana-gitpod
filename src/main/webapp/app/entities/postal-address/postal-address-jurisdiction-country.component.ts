import { Component, Input, OnInit } from '@angular/core';
import { GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';
import { IOrganizationManagement } from '../organization-management/organization-management.model';
import { IStateBoundary } from '../state-boundary/state-boundary.model';
import { StateBoundaryService } from '../state-boundary/state-boundary.service';

@Component({
  selector: 'jhi-postal-address-jurisdiction-country',
  templateUrl: './postal-address-jurisdiction-country.component.html',
})
export class PostalAddressJurisdictionCountryComponent implements OnInit {
  @Input()
  get countryId(): IOrganizationManagement {
    return this._organizationManagement;
  }
  set countryId(param: IOrganizationManagement) {
    this._organizationManagement = param;
  }

  public country: IStateBoundary[] = [];
  private _organizationManagement: IOrganizationManagement;

  constructor(private stateBoundaryService: StateBoundaryService) {}

  ngOnInit(): void {
    this.initializeCountry();
  }

  private initializeCountry(): void {
    this.stateBoundaryService
      .queryFilterBy({
        idBoundaryType: GEO_BOUNDARY_TYPE['country'],
        size: 250,
      })
      .subscribe(res => {
        this.country = res.body;
      });
  }

  public dataSource() {
    if (this.countryId.dataSource === 'h' || this.countryId.dataSource === 'H') {
      return true;
    }
    return false;
  }

  print() {
    console.log(this.countryId);
  }
}
