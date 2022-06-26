import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ITaxType, TaxType } from './tax-type.model';
import { TaxTypeService } from './tax-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-tax-type-view',
  templateUrl: './tax-type-view.component.html',
})
export class TaxTypeViewComponent extends AbstractEntityBaseViewComponent<ITaxType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  taxtypes: ITaxType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected taxTypeService: TaxTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(taxTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new TaxType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new TaxType();
        this.taxTypeService.find(this.id).subscribe(result => {
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
    this.taxTypeService.loadCacheAll().subscribe((res: ITaxType[]) => (this.taxtypes = res || []));
  }

  prepareView() {}

  get taxType() {
    return this.item;
  }

  set taxType(taxType: ITaxType) {
    this.item = taxType;
  }

  trackTaxTypeById(index: number, item: ITaxType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
