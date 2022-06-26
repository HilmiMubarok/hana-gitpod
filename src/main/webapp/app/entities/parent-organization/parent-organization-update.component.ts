import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IParentOrganization, ParentOrganization } from './parent-organization.model';
import { ParentOrganizationService } from './parent-organization.service';
import { IPartyType, PartyType } from 'app/entities/party-type/party-type.model';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IPartyRole, PartyRole } from 'app/entities/party-role/party-role.model';
import { PartyRoleService } from 'app/entities/party-role/party-role.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IPartyType | IPostalAddress | IPartyRole;

@Component({
  selector: 'jhi-parent-organization-update',
  templateUrl: './parent-organization-update.component.html',
})
export class ParentOrganizationUpdateComponent extends AbstractEntityUpdateComponent<IParentOrganization> {
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
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, parentOrganizationService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'parentOrganizationListModification';
  }

  protected initialState(): any {
    return { item: new ParentOrganization(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['partyTypeId']) {
        this.partyTypeId = params['partyTypeId'];
      }
      if (params['postalAddressId']) {
        this.postalAddressId = params['postalAddressId'];
      }
      if (params['roleId']) {
        this.roleId = params['roleId'];
      }
    });

    this.partyTypeService.loadCacheAll().subscribe((res: IPartyType[]) => (this.partytypes = res || []));

    this.postalAddressService.loadCacheAll().subscribe((res: IPostalAddress[]) => (this.postaladdresses = res || []));

    this.partyRoleService.loadCacheAll().subscribe((res: IPartyRole[]) => (this.partyroles = res || []));
  }

  protected loadRelatedEntityEffect(state: any): Observable<any> {
    const result = of(state);
    return result;
  }

  protected buildDependencyEffect(state: any): Observable<any> {
    return of(state);
  }

  protected prepareSaveEffect(state: any): Observable<any> {
    return of(state);
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
    return this.stateSubject.getValue().item.id;
  }

  get parentOrganization() {
    return this.item;
  }
}
