import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { ICreditRating, CreditRating } from './credit-rating.model';
import { CreditRatingService } from './credit-rating.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IApplication, Application } from 'app/entities/application/application.model';
import { ApplicationService } from 'app/entities/application/application.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IParty | IApplication;

@Component({
  selector: 'jhi-credit-rating-update',
  templateUrl: './credit-rating-update.component.html',
})
export class CreditRatingUpdateComponent extends AbstractEntityUpdateComponent<ICreditRating> {
  parties: IParty[] = [];

  applications: IApplication[] = [];
  partyId: string;
  applicationId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected creditRatingService: CreditRatingService,
    protected partyService: PartyService,
    protected applicationService: ApplicationService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, creditRatingService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'creditRatingListModification';
  }

  protected initialState(): any {
    return { item: new CreditRating(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['partyId']) {
        this.partyId = params['partyId'];
      }
      if (params['applicationId']) {
        this.applicationId = params['applicationId'];
      }
    });

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.applicationService.loadCacheAll().subscribe((res: IApplication[]) => (this.applications = res || []));
  }

  goToSave(): void {
    this.save();
  }

  goToPreviousState(): void {
    this.previousState();
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

  trackApplicationById(index: number, item: IApplication) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get creditRating() {
    return this.item;
  }
}
