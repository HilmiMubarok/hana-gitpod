import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IOrganizationCustomer, OrganizationCustomer } from './organization-customer.model';
import { OrganizationCustomerService } from './organization-customer.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyType, PartyType } from 'app/entities/party-type/party-type.model';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IRoleCustomer, RoleCustomer } from 'app/entities/role-customer/role-customer.model';
import { RoleCustomerService } from 'app/entities/role-customer/role-customer.service';

type SelectableEntity = IPartyType | IPostalAddress | IRoleCustomer;

@Component({
  selector: 'jhi-organization-customer-view',
  templateUrl: './organization-customer-view.component.html',
})
export class OrganizationCustomerViewComponent extends AbstractEntityBaseViewComponent<IOrganizationCustomer> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  partytypes: IPartyType[] = [];

  postaladdresses: IPostalAddress[] = [];

  rolecustomers: IRoleCustomer[] = [];
  partyTypeId: string;
  postalAddressId: number;
  roleId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected organizationCustomerService: OrganizationCustomerService,
    protected partyTypeService: PartyTypeService,
    protected postalAddressService: PostalAddressService,
    protected roleCustomerService: RoleCustomerService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(organizationCustomerService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new OrganizationCustomer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new OrganizationCustomer();
        this.organizationCustomerService.find(this.id).subscribe(result => {
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
    this.partyTypeService.loadCacheAll().subscribe((res: IPartyType[]) => (this.partytypes = res || []));

    this.postalAddressService.loadCacheAll().subscribe((res: IPostalAddress[]) => (this.postaladdresses = res || []));

    this.roleCustomerService.loadCacheAll().subscribe((res: IRoleCustomer[]) => (this.rolecustomers = res || []));
  }

  prepareView() {}

  get organizationCustomer() {
    return this.item;
  }

  set organizationCustomer(organizationCustomer: IOrganizationCustomer) {
    this.item = organizationCustomer;
  }

  trackPartyTypeById(index: number, item: IPartyType) {
    return item.id;
  }

  trackPostalAddressById(index: number, item: IPostalAddress) {
    return item.id;
  }

  trackRoleCustomerById(index: number, item: IRoleCustomer) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
