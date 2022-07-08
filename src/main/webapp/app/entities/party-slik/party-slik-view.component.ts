import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPartySlik, PartySlik } from './party-slik.model';
import { PartySlikService } from './party-slik.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';

@Component({
  selector: 'jhi-party-slik-view',
  templateUrl: './party-slik-view.component.html',
})
export class PartySlikViewComponent extends AbstractEntityBaseViewComponent<IPartySlik> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  parties: IParty[] = [];
  partyId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partySlikService: PartySlikService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(partySlikService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PartySlik();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PartySlik();
        this.partySlikService.find(this.id).subscribe(result => {
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
    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
  }

  prepareView() {}

  get partySlik() {
    return this.item;
  }

  set partySlik(partySlik: IPartySlik) {
    this.item = partySlik;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
