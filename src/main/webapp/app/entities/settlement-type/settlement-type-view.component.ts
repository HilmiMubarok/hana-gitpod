import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ISettlementType, SettlementType } from './settlement-type.model';
import { SettlementTypeService } from './settlement-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-settlement-type-view',
  templateUrl: './settlement-type-view.component.html',
})
export class SettlementTypeViewComponent extends AbstractEntityBaseViewComponent<ISettlementType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  settlementtypes: ISettlementType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected settlementTypeService: SettlementTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(settlementTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new SettlementType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new SettlementType();
        this.settlementTypeService.find(this.id).subscribe(result => {
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
    this.settlementTypeService.loadCacheAll().subscribe((res: ISettlementType[]) => (this.settlementtypes = res || []));
  }

  prepareView() {}

  get settlementType() {
    return this.item;
  }

  set settlementType(settlementType: ISettlementType) {
    this.item = settlementType;
  }

  trackSettlementTypeById(index: number, item: ISettlementType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
