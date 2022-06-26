import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IFeature, Feature } from './feature.model';
import { FeatureService } from './feature.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IFeatureType, FeatureType } from 'app/entities/feature-type/feature-type.model';
import { FeatureTypeService } from 'app/entities/feature-type/feature-type.service';

type SelectableEntity = IFeatureType | IFeature;

@Component({
  selector: 'jhi-feature-view',
  templateUrl: './feature-view.component.html',
})
export class FeatureViewComponent extends AbstractEntityBaseViewComponent<IFeature> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  featuretypes: IFeatureType[] = [];

  features: IFeature[] = [];
  featureTypeId: string;
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected featureService: FeatureService,
    protected featureTypeService: FeatureTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(featureService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Feature();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Feature();
        this.featureService.find(this.id).subscribe(result => {
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

    this.featureService.loadCacheAll().subscribe((res: IFeature[]) => (this.features = res || []));
  }

  prepareView() {}

  get feature() {
    return this.item;
  }

  set feature(feature: IFeature) {
    this.item = feature;
  }

  trackFeatureTypeById(index: number, item: IFeatureType) {
    return item.id;
  }

  trackFeatureById(index: number, item: IFeature) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
