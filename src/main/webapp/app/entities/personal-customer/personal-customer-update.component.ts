import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPersonalCustomer, PersonalCustomer } from './personal-customer.model';
import { PersonalCustomerService } from './personal-customer.service';
import { IPartyType, PartyType } from 'app/entities/party-type/party-type.model';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IReligionType, ReligionType } from 'app/entities/religion-type/religion-type.model';
import { ReligionTypeService } from 'app/entities/religion-type/religion-type.service';
import { IWorkType, WorkType } from 'app/entities/work-type/work-type.model';
import { WorkTypeService } from 'app/entities/work-type/work-type.service';
import { IRoleCustomer, RoleCustomer } from 'app/entities/role-customer/role-customer.model';
import { RoleCustomerService } from 'app/entities/role-customer/role-customer.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IPartyType | IPostalAddress | IReligionType | IWorkType | IRoleCustomer;

@Component({
  selector: 'jhi-personal-customer-update',
  templateUrl: './personal-customer-update.component.html',
})
export class PersonalCustomerUpdateComponent extends AbstractEntityUpdateComponent<IPersonalCustomer> {
  partytypes: IPartyType[] = [];
  postaladdresses: IPostalAddress[] = [];
  religiontypes: IReligionType[] = [];
  worktypes: IWorkType[] = [];
  rolecustomers: IRoleCustomer[] = [];
  partyTypeId: string;
  postalAddressId: number;
  religionTypeId: string;
  workTypeId: string;
  roleId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected personalCustomerService: PersonalCustomerService,
    protected partyTypeService: PartyTypeService,
    protected postalAddressService: PostalAddressService,
    protected religionTypeService: ReligionTypeService,
    protected workTypeService: WorkTypeService,
    protected roleCustomerService: RoleCustomerService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, personalCustomerService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'personalCustomerListModification';
  }

  protected initialState(): any {
    return { item: new PersonalCustomer(), tasks: [], id: undefined };
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
      if (params['religionTypeId']) {
        this.religionTypeId = params['religionTypeId'];
      }
      if (params['workTypeId']) {
        this.workTypeId = params['workTypeId'];
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

    this.religionTypeService.loadCacheAll().subscribe((res: IReligionType[]) => (this.religiontypes = res || []));

    this.workTypeService.loadCacheAll().subscribe((res: IWorkType[]) => (this.worktypes = res || []));

    this.roleCustomerService.loadCacheAll().subscribe((res: IRoleCustomer[]) => (this.rolecustomers = res || []));
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

  trackReligionTypeById(index: number, item: IReligionType) {
    return item.id;
  }

  trackWorkTypeById(index: number, item: IWorkType) {
    return item.id;
  }

  trackRoleCustomerById(index: number, item: IRoleCustomer) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get personalCustomer() {
    return this.item;
  }
}
