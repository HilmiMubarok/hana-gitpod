import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IBaseApplication, BaseApplication } from './base-application.model';
import { BaseApplicationService } from './base-application.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IApplicationType, ApplicationType } from 'app/entities/application-type/application-type.model';
import { ApplicationTypeService } from 'app/entities/application-type/application-type.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';

type SelectableEntity = IApplicationType | IPartyGroup;

@Component({
  selector: 'jhi-base-application-view',
  templateUrl: './base-application-view.component.html',
})
export class BaseApplicationViewComponent extends AbstractEntityBaseViewComponent<IBaseApplication> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  applicationtypes: IApplicationType[] = [];

  partygroups: IPartyGroup[] = [];
  applicationTypeId: string;
  internalId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected baseApplicationService: BaseApplicationService,
    protected applicationTypeService: ApplicationTypeService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(baseApplicationService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new BaseApplication();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new BaseApplication();
        this.baseApplicationService.find(this.id).subscribe(result => {
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

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));
  }

  prepareView() {}

  get baseApplication() {
    return this.item;
  }

  set baseApplication(baseApplication: IBaseApplication) {
    this.item = baseApplication;
  }

  trackApplicationTypeById(index: number, item: IApplicationType) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
