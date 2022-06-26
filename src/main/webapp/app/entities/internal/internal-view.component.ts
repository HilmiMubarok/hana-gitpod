import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IInternal, Internal } from './internal.model';
import { InternalService } from './internal.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IInternalType, InternalType } from 'app/entities/internal-type/internal-type.model';
import { InternalTypeService } from 'app/entities/internal-type/internal-type.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IFacility, Facility } from 'app/entities/facility/facility.model';
import { FacilityService } from 'app/entities/facility/facility.service';

type SelectableEntity = IInternalType | IInternal | IPartyGroup | IPostalAddress | IFacility;

@Component({
  selector: 'jhi-internal-view',
  templateUrl: './internal-view.component.html',
})
export class InternalViewComponent extends AbstractEntityBaseViewComponent<IInternal> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  internaltypes: IInternalType[] = [];

  internals: IInternal[] = [];

  partygroups: IPartyGroup[] = [];

  postaladdresses: IPostalAddress[] = [];

  facilities: IFacility[] = [];
  internalTypeId: string;
  parentId: number;
  partyOwnerId: string;
  postalAddressId: number;
  organizationId: string;
  facilityId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected internalService: InternalService,
    protected internalTypeService: InternalTypeService,
    protected partyGroupService: PartyGroupService,
    protected postalAddressService: PostalAddressService,
    protected facilityService: FacilityService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(internalService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Internal();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Internal();
        this.internalService.find(this.id).subscribe(result => {
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
    this.internalTypeService.loadCacheAll().subscribe((res: IInternalType[]) => (this.internaltypes = res || []));

    this.internalService.loadCacheAll().subscribe((res: IInternal[]) => (this.internals = res || []));

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));

    this.postalAddressService.loadCacheAll().subscribe((res: IPostalAddress[]) => (this.postaladdresses = res || []));

    this.facilityService.loadCacheAll().subscribe((res: IFacility[]) => (this.facilities = res || []));
  }

  prepareView() {}

  get internal() {
    return this.item;
  }

  set internal(internal: IInternal) {
    this.item = internal;
  }

  trackInternalTypeById(index: number, item: IInternalType) {
    return item.id;
  }

  trackInternalById(index: number, item: IInternal) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  trackPostalAddressById(index: number, item: IPostalAddress) {
    return item.id;
  }

  trackFacilityById(index: number, item: IFacility) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
