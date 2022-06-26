import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IParentOrganization, ParentOrganization } from './parent-organization.model';
import { ParentOrganizationService } from './parent-organization.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyType, PartyType } from 'app/entities/party-type/party-type.model';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IPartyRole, PartyRole } from 'app/entities/party-role/party-role.model';
import { PartyRoleService } from 'app/entities/party-role/party-role.service';

type SelectableEntity = IPartyType | IPostalAddress | IPartyRole;

@Component({
  selector: 'jhi-parent-organization-view',
  templateUrl: './parent-organization-view.component.html',
})
export class ParentOrganizationViewComponent extends AbstractEntityBaseViewComponent<IParentOrganization> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  partytypes: IPartyType[] = [];

  postaladdresses: IPostalAddress[] = [];

  partyroles: IPartyRole[] = [];
  partyTypeId: string;
  postalAddressId: number;
  roleId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected parentOrganizationService: ParentOrganizationService,
    protected partyTypeService: PartyTypeService,
    protected postalAddressService: PostalAddressService,
    protected partyRoleService: PartyRoleService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(parentOrganizationService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new ParentOrganization();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new ParentOrganization();
        this.parentOrganizationService.find(this.id).subscribe(result => {
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
    this.partyTypeService.loadCacheAll().subscribe((res: IPartyType[]) => (this.partytypes = res || []));

    this.postalAddressService.loadCacheAll().subscribe((res: IPostalAddress[]) => (this.postaladdresses = res || []));

    this.partyRoleService.loadCacheAll().subscribe((res: IPartyRole[]) => (this.partyroles = res || []));
  }

  prepareView() {}

  get parentOrganization() {
    return this.item;
  }

  set parentOrganization(parentOrganization: IParentOrganization) {
    this.item = parentOrganization;
  }

  trackPartyTypeById(index: number, item: IPartyType) {
    return item.id;
  }

  trackPostalAddressById(index: number, item: IPostalAddress) {
    return item.id;
  }

  trackPartyRoleById(index: number, item: IPartyRole) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
