import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { ICollateralAppraisal, CollateralAppraisal } from './collateral-appraisal.model';
import { CollateralAppraisalService } from './collateral-appraisal.service';
import { IBaseApplication, BaseApplication } from 'app/entities/base-application/base-application.model';
import { BaseApplicationService } from 'app/entities/base-application/base-application.service';
import { ICollateral, Collateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IBaseApplication | ICollateral | IParty;

@Component({
  selector: 'jhi-collateral-appraisal-update',
  templateUrl: './collateral-appraisal-update.component.html',
})
export class CollateralAppraisalUpdateComponent extends AbstractEntityUpdateComponent<ICollateralAppraisal> {
  baseapplications: IBaseApplication[] = [];

  collaterals: ICollateral[] = [];

  parties: IParty[] = [];
  applicationId: number;
  collateralId: number;
  partyId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected collateralAppraisalService: CollateralAppraisalService,
    protected baseApplicationService: BaseApplicationService,
    protected collateralService: CollateralService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, collateralAppraisalService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'collateralAppraisalListModification';
  }

  protected initialState(): any {
    return { item: new CollateralAppraisal(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['applicationId']) {
        this.applicationId = params['applicationId'];
      }
      if (params['collateralId']) {
        this.collateralId = params['collateralId'];
      }
      if (params['partyId']) {
        this.partyId = params['partyId'];
      }
    });

    this.baseApplicationService.loadCacheAll().subscribe((res: IBaseApplication[]) => (this.baseapplications = res || []));

    this.collateralService.loadCacheAll().subscribe((res: ICollateral[]) => (this.collaterals = res || []));

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

  trackBaseApplicationById(index: number, item: IBaseApplication) {
    return item.id;
  }

  trackCollateralById(index: number, item: ICollateral) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get collateralAppraisal() {
    return this.item;
  }
}
