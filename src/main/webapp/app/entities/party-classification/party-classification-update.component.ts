import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPartyClassification, PartyClassification } from './party-classification.model';
import { PartyClassificationService } from './party-classification.service';
import { IPartyCategory, PartyCategory } from 'app/entities/party-category/party-category.model';
import { PartyCategoryService } from 'app/entities/party-category/party-category.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

type SelectableEntity = IPartyCategory | IParty;

@Component({
  selector: 'jhi-party-classification-update',
  templateUrl: './party-classification-update.component.html',
})
export class PartyClassificationUpdateComponent extends AbstractEntityUpdateComponent<IPartyClassification> {
  partycategories: IPartyCategory[] = [];

  parties: IParty[] = [];
  categoryId: string;
  partyId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyClassificationService: PartyClassificationService,
    protected partyCategoryService: PartyCategoryService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, partyClassificationService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'partyClassificationListModification';
  }

  protected initialState(): any {
    return { item: new PartyClassification(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['categoryId']) {
        this.categoryId = params['categoryId'];
      }
      if (params['partyId']) {
        this.partyId = params['partyId'];
      }
    });

    this.partyCategoryService.loadCacheAll().subscribe((res: IPartyCategory[]) => (this.partycategories = res || []));

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

  trackPartyCategoryById(index: number, item: IPartyCategory) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get partyClassification() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/PartyClassification/pdf', {});
    return false;
  }
}
