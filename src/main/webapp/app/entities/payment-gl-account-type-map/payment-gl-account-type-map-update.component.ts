import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPaymentGLAccountTypeMap, PaymentGLAccountTypeMap } from './payment-gl-account-type-map.model';
import { PaymentGLAccountTypeMapService } from './payment-gl-account-type-map.service';
import { IPaymentType, PaymentType } from 'app/entities/payment-type/payment-type.model';
import { PaymentTypeService } from 'app/entities/payment-type/payment-type.service';
import { IGLAccountType, GLAccountType } from 'app/entities/gl-account-type/gl-account-type.model';
import { GLAccountTypeService } from 'app/entities/gl-account-type/gl-account-type.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IPaymentType | IGLAccountType | IPartyGroup;

@Component({
  selector: 'jhi-payment-gl-account-type-map-update',
  templateUrl: './payment-gl-account-type-map-update.component.html',
})
export class PaymentGLAccountTypeMapUpdateComponent extends AbstractEntityUpdateComponent<IPaymentGLAccountTypeMap> {
  paymenttypes: IPaymentType[] = [];

  glaccounttypes: IGLAccountType[] = [];

  partygroups: IPartyGroup[] = [];
  paymentTypeId: string;
  glAccountTypeId: string;
  organizationId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected paymentGLAccountTypeMapService: PaymentGLAccountTypeMapService,
    protected paymentTypeService: PaymentTypeService,
    protected gLAccountTypeService: GLAccountTypeService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, paymentGLAccountTypeMapService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'paymentGLAccountTypeMapListModification';
  }

  protected initialState(): any {
    return { item: new PaymentGLAccountTypeMap(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['paymentTypeId']) {
        this.paymentTypeId = params['paymentTypeId'];
      }
      if (params['glAccountTypeId']) {
        this.glAccountTypeId = params['glAccountTypeId'];
      }
      if (params['organizationId']) {
        this.organizationId = params['organizationId'];
      }
    });

    this.paymentTypeService.loadCacheAll().subscribe((res: IPaymentType[]) => (this.paymenttypes = res || []));

    this.gLAccountTypeService.loadCacheAll().subscribe((res: IGLAccountType[]) => (this.glaccounttypes = res || []));

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));
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

  trackPaymentTypeById(index: number, item: IPaymentType) {
    return item.id;
  }

  trackGLAccountTypeById(index: number, item: IGLAccountType) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get paymentGLAccountTypeMap() {
    return this.item;
  }
}
