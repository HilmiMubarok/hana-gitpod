import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IGLResourceType, GLResourceType } from './gl-resource-type.model';
import { GLResourceTypeService } from './gl-resource-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-gl-resource-type-view',
  templateUrl: './gl-resource-type-view.component.html',
})
export class GLResourceTypeViewComponent extends AbstractEntityBaseViewComponent<IGLResourceType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  glresourcetypes: IGLResourceType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected gLResourceTypeService: GLResourceTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(gLResourceTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new GLResourceType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new GLResourceType();
        this.gLResourceTypeService.find(this.id).subscribe(result => {
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
    this.gLResourceTypeService.loadCacheAll().subscribe((res: IGLResourceType[]) => (this.glresourcetypes = res || []));
  }

  prepareView() {}

  get gLResourceType() {
    return this.item;
  }

  set gLResourceType(gLResourceType: IGLResourceType) {
    this.item = gLResourceType;
  }

  trackGLResourceTypeById(index: number, item: IGLResourceType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
