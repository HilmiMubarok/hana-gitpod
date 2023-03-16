import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ILendingProgramParameter, LendingProgramParameter } from './lending-program-parameter.model';
import { LendingProgramParameterService } from './lending-program-parameter.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-lending-program-parameter-view',
  templateUrl: './lending-program-parameter-view.component.html',
})
export class LendingProgramParameterViewComponent extends AbstractEntityBaseViewComponent<ILendingProgramParameter> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected lendingProgramParameterService: LendingProgramParameterService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(lendingProgramParameterService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new LendingProgramParameter();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new LendingProgramParameter();
        this.lendingProgramParameterService.find(this.id).subscribe(result => {
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

  initialize() {}

  prepareView() {}

  get lendingProgramParameter() {
    return this.item;
  }

  set lendingProgramParameter(lendingProgramParameter: ILendingProgramParameter) {
    this.item = lendingProgramParameter;
  }

  itemKey() {
    return this.item.id;
  }
}
