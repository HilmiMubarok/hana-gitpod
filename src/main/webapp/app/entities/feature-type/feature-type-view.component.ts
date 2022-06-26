import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IFeatureType, FeatureType } from './feature-type.model';
import { FeatureTypeService } from './feature-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-feature-type-view',
  templateUrl: './feature-type-view.component.html',
})
export class FeatureTypeViewComponent extends AbstractEntityBaseViewComponent<IFeatureType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  featuretypes: IFeatureType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected featureTypeService: FeatureTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(featureTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new FeatureType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new FeatureType();
        this.featureTypeService.find(this.id).subscribe(result => {
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
    this.featureTypeService.loadCacheAll().subscribe((res: IFeatureType[]) => (this.featuretypes = res || []));
  }

  prepareView() {}

  get featureType() {
    return this.item;
  }

  set featureType(featureType: IFeatureType) {
    this.item = featureType;
  }

  trackFeatureTypeById(index: number, item: IFeatureType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
