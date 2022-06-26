import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IAcctgTrans, AcctgTrans } from './acctg-trans.model';
import { AcctgTransService } from './acctg-trans.service';
import { IAcctgTransType, AcctgTransType } from 'app/entities/acctg-trans-type/acctg-trans-type.model';
import { AcctgTransTypeService } from 'app/entities/acctg-trans-type/acctg-trans-type.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IAcctgTransType | IPartyGroup;

@Component({
  selector: 'jhi-acctg-trans-update',
  templateUrl: './acctg-trans-update.component.html',
})
export class AcctgTransUpdateComponent extends AbstractEntityUpdateComponent<IAcctgTrans> {
  acctgtranstypes: IAcctgTransType[] = [];

  partygroups: IPartyGroup[] = [];
  transTypeId: string;
  internalId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected acctgTransService: AcctgTransService,
    protected acctgTransTypeService: AcctgTransTypeService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, acctgTransService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'acctgTransListModification';
  }

  protected initialState(): any {
    return { item: new AcctgTrans(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['transTypeId']) {
        this.transTypeId = params['transTypeId'];
      }
      if (params['internalId']) {
        this.internalId = params['internalId'];
      }
    });

    this.acctgTransTypeService.loadCacheAll().subscribe((res: IAcctgTransType[]) => (this.acctgtranstypes = res || []));

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

  trackAcctgTransTypeById(index: number, item: IAcctgTransType) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get acctgTrans() {
    return this.item;
  }
}
