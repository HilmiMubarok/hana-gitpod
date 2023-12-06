import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MasterCompanyTypeService } from 'app/entities/master-parameter/master-company-type/master-company-type.service';
import { IOrganizationManagement } from 'app/entities/organization-management/organization-management.model';
import { PartyGroup } from 'app/entities/party-group/party-group.model';
import { IPartyGroup } from 'app/entities/party-group/party-group.model';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';

@Component({
  selector: 'jhi-party-cif-customer-info-party-group',
  templateUrl: './party-cif-customer-info-party-group.component.html',
  styleUrls: ['./party-cif-customer-info-party-group.style.scss'],
})
export class PartyCifCustomerInfoPartyGroupComponent extends AbstractEntityViewPageComponent<IPartyGroup> implements OnChanges {
  private _partyGroup: IPartyGroup = new PartyGroup();
  private _organization: IOrganizationManagement;
  private _source: string;
  public _managementType: string;

  public phoneNumber: any;

  @Input()
  get partyGroup() {
    return this._partyGroup;
  }

  set partyGroup(param: IPartyGroup) {
    this._partyGroup = param;
  }

  @Input()
  get organization() {
    return this._organization;
  }

  set organization(data: IOrganizationManagement) {
    this._organization = data;
  }

  @Input()
  get managementType() {
    return this._managementType;
  }

  set managementType(item: string) {
    this._managementType = item;
  }

  @Input()
  get source() {
    return this._source;
  }

  set source(data: string) {
    this._source = data;
  }

  public countryCode: string;
  public disabledData;
  constructor(protected masterCompanyTypeService: MasterCompanyTypeService) {
    super();
    this.countryCode = '';
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['source']) {
      if (this.source === 'idd') {
        if (this.organization) {
          this.disabledData = this.dataSource();
        }
      }
      if (this.source === 'customerInfo' || this.source === 'cp') {
        this.disabledData = true;
      }
    }
    this.getCompanyType();
  }

  private preSetData(param: IPartyGroup) {
    param.officePhone = `${this.countryCode}-${param.officePhone}`;
    return param;
  }

  private afterChangePartyGroup(param: IPartyGroup): void {
    this.countryCode = param.officePhone ? param.officePhone.split('-')[0] : '';
  }

  public dataSource() {
    if (this.organization.dataSource === 'h' || this.organization.dataSource === 'H') {
      return true;
    }
    return false;
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
            if (this.partyGroup.companyType === this.companyTypeData[i].code) {
              element = this.companyTypeData[i].name;
            }
          }
          this.companyTypeValue = element;
          //  this.partyGroup.companyType =
        }
      });
  }
}
