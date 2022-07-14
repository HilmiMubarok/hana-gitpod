import { Component, OnChanges, SimpleChanges, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IOrganizationManagement, OrganizationManagement } from './organization-management.model';
import { OrganizationManagementService } from './organization-management.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';

@Component({
  selector: 'jhi-organization-management-view',
  templateUrl: './organization-management-view.component.html',
})
export class OrganizationManagementViewComponent extends AbstractEntityBaseViewComponent<IOrganizationManagement> {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  partygroups: IPartyGroup[] = [];
  organizationId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected organizationManagementService: OrganizationManagementService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected toastService: MessageService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(organizationManagementService, messageService, elementRef, dataUtils, account, eventManager);
    this.organizationManagement = new OrganizationManagement();
  }

  public organizationManagement: IOrganizationManagement = new OrganizationManagement();

  initialize() {}
}
