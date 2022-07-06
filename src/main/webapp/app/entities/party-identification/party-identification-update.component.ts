import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPartyIdentification, PartyIdentification } from './party-identification.model';
import { PartyIdentificationService } from './party-identification.service';
import { IIdentificationType, IdentificationType } from 'app/entities/identification-type/identification-type.model';
import { IdentificationTypeService } from 'app/entities/identification-type/identification-type.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IIdentificationType | IParty;

@Component({
  selector: 'jhi-party-identification-update',
  templateUrl: './party-identification-update.component.html',
})
export class PartyIdentificationUpdateComponent extends AbstractEntityUpdateComponent<IPartyIdentification> {
  identificationtypes: IIdentificationType[] = [];

  parties: IParty[] = [];
  identificationTypeId: string;
  partyId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyIdentificationService: PartyIdentificationService,
    protected identificationTypeService: IdentificationTypeService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, partyIdentificationService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'partyIdentificationListModification';
  }

  protected initialState(): any {
    return { item: new PartyIdentification(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['identificationTypeId']) {
        this.identificationTypeId = params['identificationTypeId'];
      }
      if (params['partyId']) {
        this.partyId = params['partyId'];
      }
    });

    this.identificationTypeService.loadCacheAll().subscribe((res: IIdentificationType[]) => (this.identificationtypes = res || []));

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

  trackIdentificationTypeById(index: number, item: IIdentificationType) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get partyIdentification() {
    return this.item;
  }
}
