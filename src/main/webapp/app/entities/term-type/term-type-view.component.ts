import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ITermType, TermType } from './term-type.model';
import { TermTypeService } from './term-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-term-type-view',
  templateUrl: './term-type-view.component.html',
})
export class TermTypeViewComponent extends AbstractEntityBaseViewComponent<ITermType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  termtypes: ITermType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected termTypeService: TermTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(termTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new TermType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new TermType();
        this.termTypeService.find(this.id).subscribe(result => {
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
    this.termTypeService.loadCacheAll().subscribe((res: ITermType[]) => (this.termtypes = res || []));
  }

  prepareView() {}

  get termType() {
    return this.item;
  }

  set termType(termType: ITermType) {
    this.item = termType;
  }

  trackTermTypeById(index: number, item: ITermType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
