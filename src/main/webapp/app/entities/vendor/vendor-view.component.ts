import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IVendor, Vendor } from './vendor.model';
import { VendorService } from './vendor.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyType, PartyType } from 'app/entities/party-type/party-type.model';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IRoleVendor, RoleVendor } from 'app/entities/role-vendor/role-vendor.model';
import { RoleVendorService } from 'app/entities/role-vendor/role-vendor.service';

type SelectableEntity = IPartyType | IPostalAddress | IRoleVendor;

@Component({
  selector: 'jhi-vendor-view',
  templateUrl: './vendor-view.component.html',
})
export class VendorViewComponent extends AbstractEntityBaseViewComponent<IVendor> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  partytypes: IPartyType[] = [];

  postaladdresses: IPostalAddress[] = [];

  rolevendors: IRoleVendor[] = [];
  partyTypeId: string;
  postalAddressId: number;
  roleId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected vendorService: VendorService,
    protected partyTypeService: PartyTypeService,
    protected postalAddressService: PostalAddressService,
    protected roleVendorService: RoleVendorService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(vendorService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Vendor();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Vendor();
        this.vendorService.find(this.id).subscribe(result => {
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

    this.roleVendorService.loadCacheAll().subscribe((res: IRoleVendor[]) => (this.rolevendors = res || []));
  }

  prepareView() {}

  get vendor() {
    return this.item;
  }

  set vendor(vendor: IVendor) {
    this.item = vendor;
  }

  trackPartyTypeById(index: number, item: IPartyType) {
    return item.id;
  }

  trackPostalAddressById(index: number, item: IPostalAddress) {
    return item.id;
  }

  trackRoleVendorById(index: number, item: IRoleVendor) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
