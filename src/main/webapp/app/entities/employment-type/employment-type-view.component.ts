import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IEmploymentType, EmploymentType } from './employment-type.model';
import { EmploymentTypeService } from './employment-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-employment-type-view',
  templateUrl: './employment-type-view.component.html',
})
export class EmploymentTypeViewComponent extends AbstractEntityBaseViewComponent<IEmploymentType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected employmentTypeService: EmploymentTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(employmentTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new EmploymentType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new EmploymentType();
        this.employmentTypeService.find(this.id).subscribe(result => {
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

  get employmentType() {
    return this.item;
  }

  set employmentType(employmentType: IEmploymentType) {
    this.item = employmentType;
  }

  itemKey() {
    return this.item.id;
  }
}
