import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IOrganizationFinancial, OrganizationFinancial } from './organization-financial.model';
import { OrganizationFinancialService } from './organization-financial.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';

@Component({
  selector: 'jhi-organization-financial-view',
  templateUrl: './organization-financial-view.component.html',
})
export class OrganizationFinancialViewComponent extends AbstractEntityBaseViewComponent<IOrganizationFinancial> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  partygroups: IPartyGroup[] = [];
  organizationId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected organizationFinancialService: OrganizationFinancialService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(organizationFinancialService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new OrganizationFinancial();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new OrganizationFinancial();
        this.organizationFinancialService.find(this.id).subscribe(result => {
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
    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));
  }

  prepareView() {}

  get organizationFinancial() {
    return this.item;
  }

  set organizationFinancial(organizationFinancial: IOrganizationFinancial) {
    this.item = organizationFinancial;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
