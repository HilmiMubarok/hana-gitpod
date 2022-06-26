import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPeriodType, PeriodType } from './period-type.model';
import { PeriodTypeService } from './period-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-period-type-view',
  templateUrl: './period-type-view.component.html',
})
export class PeriodTypeViewComponent extends AbstractEntityBaseViewComponent<IPeriodType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  periodtypes: IPeriodType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected periodTypeService: PeriodTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(periodTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PeriodType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PeriodType();
        this.periodTypeService.find(this.id).subscribe(result => {
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
    this.periodTypeService.loadCacheAll().subscribe((res: IPeriodType[]) => (this.periodtypes = res || []));
  }

  prepareView() {}

  get periodType() {
    return this.item;
  }

  set periodType(periodType: IPeriodType) {
    this.item = periodType;
  }

  trackPeriodTypeById(index: number, item: IPeriodType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
