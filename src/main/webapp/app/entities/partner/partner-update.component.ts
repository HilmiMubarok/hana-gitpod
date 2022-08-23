import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPartner, Partner } from './partner.model';
import { PartnerService } from './partner.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { IStatusItem, StatusItem } from 'app/entities/status-item/status-item.model';
import { StatusItemService } from 'app/entities/status-item/status-item.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IPartyGroup | IStatusItem;

@Component({
  selector: 'jhi-partner-update',
  templateUrl: './partner-update.component.html',
})
export class PartnerUpdateComponent extends AbstractEntityUpdateComponent<IPartner> {
  partygroups: IPartyGroup[] = [];

  statusitems: IStatusItem[] = [];
  organizationId: string;
  statusId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partnerService: PartnerService,
    protected partyGroupService: PartyGroupService,
    protected statusItemService: StatusItemService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, partnerService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'partnerListModification';
  }

  protected initialState(): any {
    return { item: new Partner(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['organizationId']) {
        this.organizationId = params['organizationId'];
      }
      if (params['statusId']) {
        this.statusId = params['statusId'];
      }
    });

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));

    this.statusItemService.loadCacheAll().subscribe((res: IStatusItem[]) => (this.statusitems = res || []));
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

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  trackStatusItemById(index: number, item: IStatusItem) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get partner() {
    return this.item;
  }
}
