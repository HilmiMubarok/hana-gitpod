import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IOrganizationManagement } from 'app/entities/organization-management/organization-management.model';
import { IPartyGroup } from 'app/entities/party-group/party-group.model';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';

@Component({
  selector: 'jhi-party-cif-customer-info-party-group',
  templateUrl: './party-cif-customer-info-party-group.component.html',
})
export class PartyCifCustomerInfoPartyGroupComponent extends AbstractEntityViewPageComponent<IPartyGroup> implements OnChanges {
  private _partyGroup: IPartyGroup;
  private _organization: IOrganizationManagement;

  public phoneNumber: any;

  @Input()
  get partyGroup() {
    return this._partyGroup;
  }

  set partyGroup(param: IPartyGroup) {
    this._partyGroup = this.preSetData(param);
  }

  @Input()
  get organization() {
    return this._organization;
  }

  set organization(data: IOrganizationManagement) {
    this._organization = data;
  }

  public countryCode: string;
  constructor() {
    super();
    this.countryCode = '';
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyGroup']) {
      this.afterChangePartyGroup(this.partyGroup);
      this.AfterChangePhone();
    }
  }

  private preSetData(param: IPartyGroup) {
    param.officePhone = `${this.countryCode}-${param.officePhone}`;
    return param;
  }

  private afterChangePartyGroup(param: IPartyGroup): void {
    this.countryCode = param.officePhone ? param.officePhone.split('-')[0] : '';
  }

  private AfterChangePhone(): void {
    this.phoneNumber = this.partyGroup.officePhone.replace(/-/g, '');
  }

  public dataSource() {
    if (this.organization.dataSource === 'h' || this.organization.dataSource === 'H') {
      return true;
    }
    return false;
  }
}
