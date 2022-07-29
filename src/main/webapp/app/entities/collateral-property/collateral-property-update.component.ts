import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { ICollateralProperty, CollateralProperty } from './collateral-property.model';
import { CollateralPropertyService } from './collateral-property.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { ICollateral, Collateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICollateralAppraisal, CollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { CollateralAppraisalService } from 'app/entities/collateral-appraisal/collateral-appraisal.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IParty | ICollateral | ICollateralAppraisal;

@Component({
  selector: 'jhi-collateral-property-update',
  templateUrl: './collateral-property-update.component.html',
})
export class CollateralPropertyUpdateComponent extends AbstractEntityUpdateComponent<ICollateralProperty> {
  parties: IParty[] = [];

  collaterals: ICollateral[] = [];

  collateralappraisals: ICollateralAppraisal[] = [];
  partyId: string;
  collateralId: number;
  appraisalId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected collateralPropertyService: CollateralPropertyService,
    protected partyService: PartyService,
    protected collateralService: CollateralService,
    protected collateralAppraisalService: CollateralAppraisalService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, collateralPropertyService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'collateralPropertyListModification';
  }

  protected initialState(): any {
    return { item: new CollateralProperty(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['partyId']) {
        this.partyId = params['partyId'];
      }
      if (params['collateralId']) {
        this.collateralId = params['collateralId'];
      }
      if (params['appraisalId']) {
        this.appraisalId = params['appraisalId'];
      }
    });

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.collateralService.loadCacheAll().subscribe((res: ICollateral[]) => (this.collaterals = res || []));

    this.collateralAppraisalService.loadCacheAll().subscribe((res: ICollateralAppraisal[]) => (this.collateralappraisals = res || []));
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

  trackCollateralById(index: number, item: ICollateral) {
    return item.id;
  }

  trackCollateralAppraisalById(index: number, item: ICollateralAppraisal) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get collateralProperty() {
    return this.item;
  }
}
