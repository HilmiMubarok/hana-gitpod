import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPartyCif, PartyCif } from './party-cif.model';
import { PartyCifService } from './party-cif.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';

type SelectableEntity = IParty | IInternal;

@Component({
  selector: 'jhi-party-cif-view',
  templateUrl: './party-cif-view.component.html',
})
export class PartyCifViewComponent extends AbstractEntityBaseViewComponent<IPartyCif> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  parties: IParty[] = [];

  internals: IInternal[] = [];
  partyId: string;
  branchId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyCifService: PartyCifService,
    protected partyService: PartyService,
    protected internalService: InternalService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(partyCifService, messageService, elementRef, dataUtils, account, eventManager);
    // this.item = new PartyCif();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        // this.item = new PartyCif();
        this.partyCifService.find(this.id).subscribe(result => {
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

    this.internalService.loadCacheAll().subscribe((res: IInternal[]) => (this.internals = res || []));
  }

  prepareView() {}

  get partyCif() {
    return this.item;
  }

  set partyCif(partyCif: IPartyCif) {
    this.item = partyCif;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  trackInternalById(index: number, item: IInternal) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
