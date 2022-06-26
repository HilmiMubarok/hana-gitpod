import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IVendor, Vendor } from './vendor.model';
import { VendorService } from './vendor.service';
import { IPartyType, PartyType } from 'app/entities/party-type/party-type.model';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IRoleVendor, RoleVendor } from 'app/entities/role-vendor/role-vendor.model';
import { RoleVendorService } from 'app/entities/role-vendor/role-vendor.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IPartyType | IPostalAddress | IRoleVendor;

@Component({
  selector: 'jhi-vendor-update',
  templateUrl: './vendor-update.component.html',
})
export class VendorUpdateComponent extends AbstractEntityUpdateComponent<IVendor> {
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
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, vendorService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'vendorListModification';
  }

  protected initialState(): any {
    return { item: new Vendor(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['partyTypeId']) {
        this.partyTypeId = params['partyTypeId'];
      }
      if (params['postalAddressId']) {
        this.postalAddressId = params['postalAddressId'];
      }
      if (params['roleId']) {
        this.roleId = params['roleId'];
      }
    });

    this.partyTypeService.loadCacheAll().subscribe((res: IPartyType[]) => (this.partytypes = res || []));

    this.postalAddressService.loadCacheAll().subscribe((res: IPostalAddress[]) => (this.postaladdresses = res || []));

    this.roleVendorService.loadCacheAll().subscribe((res: IRoleVendor[]) => (this.rolevendors = res || []));
  }

  protected loadRelatedEntityEffect(state: any): Observable<any> {
    const result = of(state);
    return result;
  }

  protected buildDependencyEffect(state: any): Observable<any> {
    return of(state);
  }

  protected prepareSaveEffect(state: any): Observable<any> {
    return of(state);
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
    return this.stateSubject.getValue().item.id;
  }

  get vendor() {
    return this.item;
  }
}
