import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IFuncSetting, FuncSetting } from './func-setting.model';
import { FuncSettingService } from './func-setting.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-func-setting-view',
  templateUrl: './func-setting-view.component.html',
})
export class FuncSettingViewComponent extends AbstractEntityBaseViewComponent<IFuncSetting> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  funcsettings: IFuncSetting[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected funcSettingService: FuncSettingService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(funcSettingService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new FuncSetting();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new FuncSetting();
        this.funcSettingService.find(this.id).subscribe(result => {
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
    this.funcSettingService.loadCacheAll().subscribe((res: IFuncSetting[]) => (this.funcsettings = res || []));
  }

  prepareView() {}

  get funcSetting() {
    return this.item;
  }

  set funcSetting(funcSetting: IFuncSetting) {
    this.item = funcSetting;
  }

  trackFuncSettingById(index: number, item: IFuncSetting) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
