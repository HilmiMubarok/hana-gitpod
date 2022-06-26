import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IInternalType, InternalType } from './internal-type.model';
import { InternalTypeService } from './internal-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyType, PartyType } from 'app/entities/party-type/party-type.model';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';

@Component({
  selector: 'jhi-internal-type-view',
  templateUrl: './internal-type-view.component.html',
})
export class InternalTypeViewComponent extends AbstractEntityBaseViewComponent<IInternalType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  partytypes: IPartyType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected internalTypeService: InternalTypeService,
    protected partyTypeService: PartyTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(internalTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new InternalType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new InternalType();
        this.internalTypeService.find(this.id).subscribe(result => {
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
  }

  prepareView() {}

  get internalType() {
    return this.item;
  }

  set internalType(internalType: IInternalType) {
    this.item = internalType;
  }

  trackPartyTypeById(index: number, item: IPartyType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
