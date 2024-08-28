import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IFuncSettingTemplate, FuncSettingTemplate } from './func-setting-template.model';
import { FuncSettingTemplateService } from './func-setting-template.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IProductType, ProductType } from 'app/entities/product-type/product-type.model';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';
import { IFeature, Feature } from 'app/entities/feature/feature.model';
import { FeatureService } from 'app/entities/feature/feature.service';
import { IFuncSetting, FuncSetting } from 'app/entities/func-setting/func-setting.model';
import { FuncSettingService } from 'app/entities/func-setting/func-setting.service';

type SelectableEntity = IProductType | IFeature | IFuncSetting;

@Component({
  selector: 'jhi-func-setting-template-view',
  templateUrl: './func-setting-template-view.component.html',
})
export class FuncSettingTemplateViewComponent extends AbstractEntityBaseViewComponent<IFuncSettingTemplate> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  producttypes: IProductType[] = [];

  features: IFeature[] = [];

  funcsettings: IFuncSetting[] = [];
  productTypeId: string;
  featureItems: IFeature[] = [];
  featureSelect: IFeature;
  featureId: string;
  funcSettingId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected funcSettingTemplateService: FuncSettingTemplateService,
    protected productTypeService: ProductTypeService,
    protected featureService: FeatureService,
    protected funcSettingService: FuncSettingService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(funcSettingTemplateService, messageService, elementRef, dataUtils, account, eventManager);
    this.featureSelect = new Feature();
    this.item = new FuncSettingTemplate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new FuncSettingTemplate();
        this.funcSettingTemplateService.find(this.id).subscribe(result => {
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
    this.productTypeService.loadCacheAll().subscribe((res: IProductType[]) => (this.producttypes = res || []));

    this.featureService.loadCacheAll().subscribe((res: IFeature[]) => (this.features = res || []));

    this.funcSettingService.loadCacheAll().subscribe((res: IFuncSetting[]) => (this.funcsettings = res || []));
  }

  prepareView() {
    if (this.funcSettingTemplate.featureId) {
      this.featureService.find(this.funcSettingTemplate.featureId).subscribe(
        (value: HttpResponse<IFeature>) => {
          this.featureSelect = value.body;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }

  get funcSettingTemplate() {
    return this.item;
  }

  set funcSettingTemplate(funcSettingTemplate: IFuncSettingTemplate) {
    this.item = funcSettingTemplate;
  }

  trackProductTypeById(index: number, item: IProductType) {
    return item.id;
  }

  trackFuncSettingById(index: number, item: IFuncSetting) {
    return item.id;
  }

  searchfeature(event: any) {
    this.featureService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IFeature[]>) => {
      this.featureItems = res.body;
    });
  }

  selectfeature(value: any) {
    this.item.featureId = this.featureSelect.id;
  }

  itemKey() {
    return this.item.id;
  }
}
