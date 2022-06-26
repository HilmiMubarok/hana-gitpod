import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPurposeType, PurposeType } from './purpose-type.model';
import { PurposeTypeService } from './purpose-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-purpose-type-view',
  templateUrl: './purpose-type-view.component.html',
})
export class PurposeTypeViewComponent extends AbstractEntityBaseViewComponent<IPurposeType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  purposetypes: IPurposeType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected purposeTypeService: PurposeTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(purposeTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PurposeType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PurposeType();
        this.purposeTypeService.find(this.id).subscribe(result => {
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
    this.purposeTypeService.loadCacheAll().subscribe((res: IPurposeType[]) => (this.purposetypes = res || []));
  }

  prepareView() {}

  get purposeType() {
    return this.item;
  }

  set purposeType(purposeType: IPurposeType) {
    this.item = purposeType;
  }

  trackPurposeTypeById(index: number, item: IPurposeType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
