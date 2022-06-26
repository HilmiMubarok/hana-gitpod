import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IApplicationType, ApplicationType } from './application-type.model';
import { ApplicationTypeService } from './application-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-application-type-view',
  templateUrl: './application-type-view.component.html',
})
export class ApplicationTypeViewComponent extends AbstractEntityBaseViewComponent<IApplicationType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  applicationtypes: IApplicationType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected applicationTypeService: ApplicationTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(applicationTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new ApplicationType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new ApplicationType();
        this.applicationTypeService.find(this.id).subscribe(result => {
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
    this.applicationTypeService.loadCacheAll().subscribe((res: IApplicationType[]) => (this.applicationtypes = res || []));
  }

  prepareView() {}

  get applicationType() {
    return this.item;
  }

  set applicationType(applicationType: IApplicationType) {
    this.item = applicationType;
  }

  trackApplicationTypeById(index: number, item: IApplicationType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
