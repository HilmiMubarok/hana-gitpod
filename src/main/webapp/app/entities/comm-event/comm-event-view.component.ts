import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ICommEvent, CommEvent } from './comm-event.model';
import { CommEventService } from './comm-event.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
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

type SelectableEntity = ICommEventType | IPurposeType | IStatusItem | IParty | IContactMech;

@Component({
  selector: 'jhi-comm-event-view',
  templateUrl: './comm-event-view.component.html',
})
export class CommEventViewComponent extends AbstractEntityBaseViewComponent<ICommEvent> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

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
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(commEventService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new CommEvent();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new CommEvent();
        this.commEventService.find(this.id).subscribe(result => {
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
    this.commEventTypeService.loadCacheAll().subscribe((res: ICommEventType[]) => (this.commeventtypes = res || []));

    this.purposeTypeService.loadCacheAll().subscribe((res: IPurposeType[]) => (this.purposetypes = res || []));

    this.statusItemService.loadCacheAll().subscribe((res: IStatusItem[]) => (this.statusitems = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.contactMechService.loadCacheAll().subscribe((res: IContactMech[]) => (this.contactmeches = res || []));
  }

  prepareView() {}

  get commEvent() {
    return this.item;
  }

  set commEvent(commEvent: ICommEvent) {
    this.item = commEvent;
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
    return this.item.id;
  }
}
