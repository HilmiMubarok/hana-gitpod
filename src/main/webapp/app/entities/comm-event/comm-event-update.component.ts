import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { ICommEvent, CommEvent } from './comm-event.model';
import { CommEventService } from './comm-event.service';
import { ICommEventType, CommEventType } from 'app/entities/comm-event-type/comm-event-type.model';
import { CommEventTypeService } from 'app/entities/comm-event-type/comm-event-type.service';
import { IPurposeType, PurposeType } from 'app/entities/purpose-type/purpose-type.model';
import { PurposeTypeService } from 'app/entities/purpose-type/purpose-type.service';
import { IStatusItem, StatusItem } from 'app/entities/status-item/status-item.model';
import { StatusItemService } from 'app/entities/status-item/status-item.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IContactMech, ContactMech } from 'app/entities/contact-mech/contact-mech.model';
import { ContactMechService } from 'app/entities/contact-mech/contact-mech.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = ICommEventType | IPurposeType | IStatusItem | IParty | IContactMech;

@Component({
  selector: 'jhi-comm-event-update',
  templateUrl: './comm-event-update.component.html',
})
export class CommEventUpdateComponent extends AbstractEntityUpdateComponent<ICommEvent> {
  commeventtypes: ICommEventType[] = [];

  purposetypes: IPurposeType[] = [];

  statusitems: IStatusItem[] = [];

  parties: IParty[] = [];

  contactmeches: IContactMech[] = [];
  commEventTypeId: string;
  purposeTypeId: string;
  statusItemId: string;
  partyId: string;
  contactMechId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected commEventService: CommEventService,
    protected commEventTypeService: CommEventTypeService,
    protected purposeTypeService: PurposeTypeService,
    protected statusItemService: StatusItemService,
    protected partyService: PartyService,
    protected contactMechService: ContactMechService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, commEventService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'commEventListModification';
  }

  protected initialState(): any {
    return { item: new CommEvent(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['commEventTypeId']) {
        this.commEventTypeId = params['commEventTypeId'];
      }
      if (params['purposeTypeId']) {
        this.purposeTypeId = params['purposeTypeId'];
      }
      if (params['statusItemId']) {
        this.statusItemId = params['statusItemId'];
      }
      if (params['partyId']) {
        this.partyId = params['partyId'];
      }
      if (params['contactMechId']) {
        this.contactMechId = params['contactMechId'];
      }
    });

    this.commEventTypeService.loadCacheAll().subscribe((res: ICommEventType[]) => (this.commeventtypes = res || []));

    this.purposeTypeService.loadCacheAll().subscribe((res: IPurposeType[]) => (this.purposetypes = res || []));

    this.statusItemService.loadCacheAll().subscribe((res: IStatusItem[]) => (this.statusitems = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.contactMechService.loadCacheAll().subscribe((res: IContactMech[]) => (this.contactmeches = res || []));
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

  trackCommEventTypeById(index: number, item: ICommEventType) {
    return item.id;
  }

  trackPurposeTypeById(index: number, item: IPurposeType) {
    return item.id;
  }

  trackStatusItemById(index: number, item: IStatusItem) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  trackContactMechById(index: number, item: IContactMech) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get commEvent() {
    return this.item;
  }
}
