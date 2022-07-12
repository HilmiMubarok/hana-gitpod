import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IFuncSettingAppl, FuncSettingAppl } from './func-setting-appl.model';
import { FuncSettingApplService } from './func-setting-appl.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IFeatureApplicable, FeatureApplicable } from 'app/entities/feature-applicable/feature-applicable.model';
import { FeatureApplicableService } from 'app/entities/feature-applicable/feature-applicable.service';
import { IFuncSetting, FuncSetting } from 'app/entities/func-setting/func-setting.model';
import { FuncSettingService } from 'app/entities/func-setting/func-setting.service';

type SelectableEntity = IFeatureApplicable | IFuncSetting;

@Component({
  selector: 'jhi-func-setting-appl-view',
  templateUrl: './func-setting-appl-view.component.html',
})
export class FuncSettingApplViewComponent extends AbstractEntityBaseViewComponent<IFuncSettingAppl> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  featureapplicables: IFeatureApplicable[] = [];

  funcsettings: IFuncSetting[] = [];
  featureApplicableItems: IFeatureApplicable[] = [];
  featureApplicableSelect: IFeatureApplicable;
  featureApplicableId: number;
  funcSettingId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected funcSettingApplService: FuncSettingApplService,
    protected featureApplicableService: FeatureApplicableService,
    protected funcSettingService: FuncSettingService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(funcSettingApplService, messageService, elementRef, dataUtils, account, eventManager);
    this.featureApplicableSelect = new FeatureApplicable();
    this.item = new FuncSettingAppl();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new FuncSettingAppl();
        this.funcSettingApplService.find(this.id).subscribe(result => {
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
    this.featureApplicableService.loadCacheAll().subscribe((res: IFeatureApplicable[]) => (this.featureapplicables = res || []));

    this.funcSettingService.loadCacheAll().subscribe((res: IFuncSetting[]) => (this.funcsettings = res || []));
  }

  prepareView() {
    if (this.funcSettingAppl.featureApplicableId) {
      this.featureApplicableService.find(this.funcSettingAppl.featureApplicableId).subscribe(
        (value: HttpResponse<IFeatureApplicable>) => {
          this.featureApplicableSelect = value.body;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }

  get funcSettingAppl() {
    return this.item;
  }

  set funcSettingAppl(funcSettingAppl: IFuncSettingAppl) {
    this.item = funcSettingAppl;
  }

  trackFuncSettingById(index: number, item: IFuncSetting) {
    return item.id;
  }

  searchfeatureApplicable(event: any) {
    this.featureApplicableService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IFeatureApplicable[]>) => {
      this.featureApplicableItems = res.body;
    });
  }

  selectfeatureApplicable(value: any) {
    this.item.featureApplicableId = this.featureApplicableSelect.id;
  }

  itemKey() {
    return this.item.id;
  }
}
