import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPartyGroup, PartyGroup } from './party-group.model';
import { PartyGroupService } from './party-group.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyType, PartyType } from 'app/entities/party-type/party-type.model';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';

type SelectableEntity = IPartyType | IPostalAddress;

@Component({
  selector: 'jhi-party-group-view',
  templateUrl: './party-group-view.component.html',
})
export class PartyGroupViewComponent extends AbstractEntityBaseViewComponent<IPartyGroup> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  partyTypeId: string;
  postalAddressId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyGroupService: PartyGroupService,
    protected partyTypeService: PartyTypeService,
    protected postalAddressService: PostalAddressService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(partyGroupService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PartyGroup();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['item']) {
      if (changes['item'].isFirstChange()) {
        this.initialize();
      }
      if (this.item) {
        this.prepareView();
      }
    }
  }

  initialize() {
  }

  prepareView() {}

  get partyGroup() {
    return this.item;
  }

  set partyGroup(partyGroup: IPartyGroup) {
    this.item = partyGroup;
  }

  trackPartyTypeById(index: number, item: IPartyType) {
    return item.id;
  }

  trackPostalAddressById(index: number, item: IPostalAddress) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
