import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IReceipt, Receipt } from './receipt.model';
import { ReceiptService } from './receipt.service';
import { IPaymentType, PaymentType } from 'app/entities/payment-type/payment-type.model';
import { PaymentTypeService } from 'app/entities/payment-type/payment-type.service';
import { IPaymentMethod, PaymentMethod } from 'app/entities/payment-method/payment-method.model';
import { PaymentMethodService } from 'app/entities/payment-method/payment-method.service';
import { IFinAccountTrans, FinAccountTrans } from 'app/entities/fin-account-trans/fin-account-trans.model';
import { FinAccountTransService } from 'app/entities/fin-account-trans/fin-account-trans.service';
import { IAcctgTrans, AcctgTrans } from 'app/entities/acctg-trans/acctg-trans.model';
import { AcctgTransService } from 'app/entities/acctg-trans/acctg-trans.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

type SelectableEntity = IPaymentType | IPaymentMethod | IFinAccountTrans | IAcctgTrans | IParty;

@Component({
  selector: 'jhi-receipt-update',
  templateUrl: './receipt-update.component.html',
})
export class ReceiptUpdateComponent extends AbstractEntityUpdateComponent<IReceipt> {
  paymenttypes: IPaymentType[] = [];

  paymentmethods: IPaymentMethod[] = [];

  finaccounttrans: IFinAccountTrans[] = [];

  acctgtrans: IAcctgTrans[] = [];

  parties: IParty[] = [];
  paymentTypeId: string;
  paymentMethodId: number;
  accountTransId: number;
  acctgTransId: number;
  paidFromId: string;
  paidToId: string;
  internalId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected receiptService: ReceiptService,
    protected paymentTypeService: PaymentTypeService,
    protected paymentMethodService: PaymentMethodService,
    protected finAccountTransService: FinAccountTransService,
    protected acctgTransService: AcctgTransService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, receiptService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'receiptListModification';
  }

  protected initialState(): any {
    return { item: new Receipt(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['paymentTypeId']) {
        this.paymentTypeId = params['paymentTypeId'];
      }
      if (params['paymentMethodId']) {
        this.paymentMethodId = params['paymentMethodId'];
      }
      if (params['accountTransId']) {
        this.accountTransId = params['accountTransId'];
      }
      if (params['acctgTransId']) {
        this.acctgTransId = params['acctgTransId'];
      }
      if (params['paidFromId']) {
        this.paidFromId = params['paidFromId'];
      }
      if (params['paidToId']) {
        this.paidToId = params['paidToId'];
      }
      if (params['internalId']) {
        this.internalId = params['internalId'];
      }
    });

    this.paymentTypeService.loadCacheAll().subscribe((res: IPaymentType[]) => (this.paymenttypes = res || []));

    this.paymentMethodService.loadCacheAll().subscribe((res: IPaymentMethod[]) => (this.paymentmethods = res || []));

    this.finAccountTransService.loadCacheAll().subscribe((res: IFinAccountTrans[]) => (this.finaccounttrans = res || []));

    this.acctgTransService.loadCacheAll().subscribe((res: IAcctgTrans[]) => (this.acctgtrans = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
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

  trackPaymentMethodById(index: number, item: IPaymentMethod) {
    return item.id;
  }

  trackFinAccountTransById(index: number, item: IFinAccountTrans) {
    return item.id;
  }

  trackAcctgTransById(index: number, item: IAcctgTrans) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get receipt() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/Receipt/pdf', {});
    return false;
  }
}
