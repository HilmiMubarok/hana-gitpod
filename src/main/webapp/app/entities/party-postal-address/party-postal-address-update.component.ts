import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPartyPostalAddress, PartyPostalAddress } from './party-postal-address.model';
import { PartyPostalAddressService } from './party-postal-address.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IPurposeType, PurposeType } from 'app/entities/purpose-type/purpose-type.model';
import { PurposeTypeService } from 'app/entities/purpose-type/purpose-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IParty | IPostalAddress | IPurposeType;

@Component({
  selector: 'jhi-party-postal-address-update',
  templateUrl: './party-postal-address-update.component.html',
})
export class PartyPostalAddressUpdateComponent extends AbstractEntityUpdateComponent<IPartyPostalAddress> {
  parties: IParty[] = [];

  postaladdresses: IPostalAddress[] = [];

  purposetypes: IPurposeType[] = [];
  partyId: string;
  addressId: number;
  purposeTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyPostalAddressService: PartyPostalAddressService,
    protected partyService: PartyService,
    protected postalAddressService: PostalAddressService,
    protected purposeTypeService: PurposeTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, partyPostalAddressService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'partyPostalAddressListModification';
  }

  protected initialState(): any {
    return { item: new PartyPostalAddress(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['partyId']) {
        this.partyId = params['partyId'];
      }
      if (params['addressId']) {
        this.addressId = params['addressId'];
      }
      if (params['purposeTypeId']) {
        this.purposeTypeId = params['purposeTypeId'];
      }
    });

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.postalAddressService.loadCacheAll().subscribe((res: IPostalAddress[]) => (this.postaladdresses = res || []));

    this.purposeTypeService.loadCacheAll().subscribe((res: IPurposeType[]) => (this.purposetypes = res || []));
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

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  trackPostalAddressById(index: number, item: IPostalAddress) {
    return item.id;
  }

  trackPurposeTypeById(index: number, item: IPurposeType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get partyPostalAddress() {
    return this.item;
  }
}
