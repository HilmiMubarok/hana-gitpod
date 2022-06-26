import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPartyPaymentPref, PartyPaymentPref } from './party-payment-pref.model';
import { PartyPaymentPrefService } from './party-payment-pref.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IPaymentMethodType, PaymentMethodType } from 'app/entities/payment-method-type/payment-method-type.model';
import { PaymentMethodTypeService } from 'app/entities/payment-method-type/payment-method-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IParty | IPaymentMethodType;

@Component({
  selector: 'jhi-party-payment-pref-update',
  templateUrl: './party-payment-pref-update.component.html',
})
export class PartyPaymentPrefUpdateComponent extends AbstractEntityUpdateComponent<IPartyPaymentPref> {
  parties: IParty[] = [];

  paymentmethodtypes: IPaymentMethodType[] = [];
  partyId: string;
  paymentMethodTypeId: string;
  providerId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyPaymentPrefService: PartyPaymentPrefService,
    protected partyService: PartyService,
    protected paymentMethodTypeService: PaymentMethodTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, partyPaymentPrefService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'partyPaymentPrefListModification';
  }

  protected initialState(): any {
    return { item: new PartyPaymentPref(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['partyId']) {
        this.partyId = params['partyId'];
      }
      if (params['paymentMethodTypeId']) {
        this.paymentMethodTypeId = params['paymentMethodTypeId'];
      }
      if (params['providerId']) {
        this.providerId = params['providerId'];
      }
    });

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.paymentMethodTypeService.loadCacheAll().subscribe((res: IPaymentMethodType[]) => (this.paymentmethodtypes = res || []));
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

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  trackPaymentMethodTypeById(index: number, item: IPaymentMethodType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get partyPaymentPref() {
    return this.item;
  }
}
