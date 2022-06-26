import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IGLAccountClass, GLAccountClass } from './gl-account-class.model';
import { GLAccountClassService } from './gl-account-class.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-gl-account-class-view',
  templateUrl: './gl-account-class-view.component.html',
})
export class GLAccountClassViewComponent extends AbstractEntityBaseViewComponent<IGLAccountClass> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  glaccountclasses: IGLAccountClass[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected gLAccountClassService: GLAccountClassService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(gLAccountClassService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new GLAccountClass();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new GLAccountClass();
        this.gLAccountClassService.find(this.id).subscribe(result => {
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
    this.gLAccountClassService.loadCacheAll().subscribe((res: IGLAccountClass[]) => (this.glaccountclasses = res || []));
  }

  prepareView() {}

  get gLAccountClass() {
    return this.item;
  }

  set gLAccountClass(gLAccountClass: IGLAccountClass) {
    this.item = gLAccountClass;
  }

  trackGLAccountClassById(index: number, item: IGLAccountClass) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
