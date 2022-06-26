import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IInternal, Internal } from './internal.model';
import { InternalService } from './internal.service';
import { IInternalType, InternalType } from 'app/entities/internal-type/internal-type.model';
import { InternalTypeService } from 'app/entities/internal-type/internal-type.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IFacility, Facility } from 'app/entities/facility/facility.model';
import { FacilityService } from 'app/entities/facility/facility.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IInternalType | IInternal | IPartyGroup | IPostalAddress | IFacility;

@Component({
  selector: 'jhi-internal-update',
  templateUrl: './internal-update.component.html',
})
export class InternalUpdateComponent extends AbstractEntityUpdateComponent<IInternal> {
  internaltypes: IInternalType[] = [];

  internals: IInternal[] = [];

  partygroups: IPartyGroup[] = [];

  postaladdresses: IPostalAddress[] = [];

  facilities: IFacility[] = [];
  internalTypeId: string;
  parentId: number;
  partyOwnerId: string;
  postalAddressId: number;
  organizationId: string;
  facilityId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected internalService: InternalService,
    protected internalTypeService: InternalTypeService,
    protected partyGroupService: PartyGroupService,
    protected postalAddressService: PostalAddressService,
    protected facilityService: FacilityService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, internalService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'internalListModification';
  }

  protected initialState(): any {
    return { item: new Internal(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['internalTypeId']) {
        this.internalTypeId = params['internalTypeId'];
      }
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
      if (params['partyOwnerId']) {
        this.partyOwnerId = params['partyOwnerId'];
      }
      if (params['postalAddressId']) {
        this.postalAddressId = params['postalAddressId'];
      }
      if (params['organizationId']) {
        this.organizationId = params['organizationId'];
      }
      if (params['facilityId']) {
        this.facilityId = params['facilityId'];
      }
    });

    this.internalTypeService.loadCacheAll().subscribe((res: IInternalType[]) => (this.internaltypes = res || []));

    this.internalService.loadCacheAll().subscribe((res: IInternal[]) => (this.internals = res || []));

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));

    this.postalAddressService.loadCacheAll().subscribe((res: IPostalAddress[]) => (this.postaladdresses = res || []));

    this.facilityService.loadCacheAll().subscribe((res: IFacility[]) => (this.facilities = res || []));
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

  trackInternalTypeById(index: number, item: IInternalType) {
    return item.id;
  }

  trackInternalById(index: number, item: IInternal) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  trackPostalAddressById(index: number, item: IPostalAddress) {
    return item.id;
  }

  trackFacilityById(index: number, item: IFacility) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get internal() {
    return this.item;
  }
}
