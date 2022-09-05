import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { ISurveyBatch, SurveyBatch } from './survey-batch.model';
import { SurveyBatchService } from './survey-batch.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

@Component({
  selector: 'jhi-survey-batch-update',
  templateUrl: './survey-batch-update.component.html',
})
export class SurveyBatchUpdateComponent extends AbstractEntityUpdateComponent<ISurveyBatch> {
  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected surveyBatchService: SurveyBatchService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, surveyBatchService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'surveyBatchListModification';
  }

  protected initialState(): any {
    return { item: new SurveyBatch(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
    });
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

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get surveyBatch() {
    return this.item;
  }
}
