import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IStatusItem, StatusItem } from './status-item.model';
import { StatusItemService } from './status-item.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-status-item-view',
  templateUrl: './status-item-view.component.html',
})
export class StatusItemViewComponent extends AbstractEntityBaseViewComponent<IStatusItem> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected statusItemService: StatusItemService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(statusItemService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new StatusItem();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new StatusItem();
        this.statusItemService.find(this.id).subscribe(result => {
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

  initialize() {}

  prepareView() {}

  get statusItem() {
    return this.item;
  }

  set statusItem(statusItem: IStatusItem) {
    this.item = statusItem;
  }

  itemKey() {
    return this.item.id;
  }
}
