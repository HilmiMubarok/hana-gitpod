import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPartyCif, PartyCif } from './party-cif.model';
import { PartyCifService } from './party-cif.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IParty | IInternal;

@Component({
  selector: 'jhi-party-cif-update',
  templateUrl: './party-cif-update.component.html',
})
export class PartyCifUpdateComponent extends AbstractEntityUpdateComponent<IPartyCif> {
  parties: IParty[] = [];

  internals: IInternal[] = [];
  partyId: string;
  branchId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyCifService: PartyCifService,
    protected partyService: PartyService,
    protected internalService: InternalService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, partyCifService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'partyCifListModification';
  }

  protected initialState(): any {
    return { item: new PartyCif(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['partyId']) {
        this.partyId = params['partyId'];
      }
      if (params['branchId']) {
        this.branchId = params['branchId'];
      }
    });

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.internalService.loadCacheAll().subscribe((res: IInternal[]) => (this.internals = res || []));
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

  trackInternalById(index: number, item: IInternal) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get partyCif() {
    return this.item;
  }
}
