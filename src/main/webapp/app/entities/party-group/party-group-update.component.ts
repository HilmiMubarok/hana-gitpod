import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPartyGroup, PartyGroup } from './party-group.model';
import { PartyGroupService } from './party-group.service';
import { IPartyType, PartyType } from 'app/entities/party-type/party-type.model';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IPartyType | IPostalAddress;

@Component({
  selector: 'jhi-party-group-update',
  templateUrl: './party-group-update.component.html',
})
export class PartyGroupUpdateComponent extends AbstractEntityUpdateComponent<IPartyGroup> {
  public partyGroupModel: IPartyGroup = new PartyGroup();
  partytypes: IPartyType[] = [];

  postaladdresses: IPostalAddress[] = [];
  partyTypeId: string;
  postalAddressId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyGroupService: PartyGroupService,
    protected partyTypeService: PartyTypeService,
    protected postalAddressService: PostalAddressService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, partyGroupService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'partyGroupListModification';
  }

  protected initialState(): any {
    return { item: new PartyGroup(), tasks: [], id: undefined };
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
    });

    this.partyTypeService.loadCacheAll().subscribe((res: IPartyType[]) => (this.partytypes = res || []));

    this.postalAddressService.loadCacheAll().subscribe((res: IPostalAddress[]) => (this.postaladdresses = res || []));
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

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  public data: string[] = ['Snooker', 'Tennis', 'Cricket', 'Football', 'Rugby'];

  saveData() {
    console.log(this.partyGroupModel);
    // this.partyGroupService.preSave(this.partyGroupModel);
  }

  get partyGroup() {
    return this.item;
  }
}
