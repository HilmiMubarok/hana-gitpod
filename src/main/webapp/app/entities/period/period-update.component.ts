import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IPeriod, Period } from './period.model';
import { PeriodService } from './period.service';
import { IPeriodType, PeriodType } from 'app/entities/period-type/period-type.model';
import { PeriodTypeService } from 'app/entities/period-type/period-type.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

type SelectableEntity = IPeriodType | IPeriod | IParty;

@Component({
  selector: 'jhi-period-update',
  templateUrl: './period-update.component.html',
})
export class PeriodUpdateComponent extends AbstractEntityUpdateComponent<IPeriod> {
  periodtypes: IPeriodType[] = [];

  periods: IPeriod[] = [];

  parties: IParty[] = [];
  periodTypeId: string;
  parentId: number;
  ownerId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected periodService: PeriodService,
    protected periodTypeService: PeriodTypeService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, periodService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'periodListModification';
  }

  protected initialState(): any {
    return { item: new Period(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['periodTypeId']) {
        this.periodTypeId = params['periodTypeId'];
      }
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
      if (params['ownerId']) {
        this.ownerId = params['ownerId'];
      }
    });

    this.periodTypeService.loadCacheAll().subscribe((res: IPeriodType[]) => (this.periodtypes = res || []));

    this.periodService.loadCacheAll().subscribe((res: IPeriod[]) => (this.periods = res || []));

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

  trackPeriodTypeById(index: number, item: IPeriodType) {
    return item.id;
  }

  trackPeriodById(index: number, item: IPeriod) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get period() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/Period/pdf', {});
    return false;
  }
}
