import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPartyPostalAddress, PartyPostalAddress } from './party-postal-address.model';
import { PartyPostalAddressService } from './party-postal-address.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IPurposeType, PurposeType } from 'app/entities/purpose-type/purpose-type.model';
import { PurposeTypeService } from 'app/entities/purpose-type/purpose-type.service';

type SelectableEntity = IParty | IPostalAddress | IPurposeType;

@Component({
  selector: 'jhi-party-postal-address-view',
  templateUrl: './party-postal-address-view.component.html',
})
export class PartyPostalAddressViewComponent extends AbstractEntityBaseViewComponent<IPartyPostalAddress> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  parties: IParty[] = [];

  postaladdresses: IPostalAddress[] = [];

  purposetypes: IPurposeType[] = [];
  partyId: string;
  addressId: number;
  purposeTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyPostalAddressService: PartyPostalAddressService,
    protected partyService: PartyService,
    protected postalAddressService: PostalAddressService,
    protected purposeTypeService: PurposeTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(partyPostalAddressService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PartyPostalAddress();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PartyPostalAddress();
        this.partyPostalAddressService.find(this.id).subscribe(result => {
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
    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.postalAddressService.loadCacheAll().subscribe((res: IPostalAddress[]) => (this.postaladdresses = res || []));

    this.purposeTypeService.loadCacheAll().subscribe((res: IPurposeType[]) => (this.purposetypes = res || []));
  }

  prepareView() {}

  get partyPostalAddress() {
    return this.item;
  }

  set partyPostalAddress(partyPostalAddress: IPartyPostalAddress) {
    this.item = partyPostalAddress;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  trackPostalAddressById(index: number, item: IPostalAddress) {
    return item.id;
  }

  trackPurposeTypeById(index: number, item: IPurposeType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
