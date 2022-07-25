import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { ICollateral, Collateral } from './collateral.model';
import { CollateralService } from './collateral.service';
import { ICollateralType, CollateralType } from 'app/entities/collateral-type/collateral-type.model';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IApplication, Application } from 'app/entities/application/application.model';
import { ApplicationService } from 'app/entities/application/application.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

type SelectableEntity = ICollateralType | IParty | IApplication;

@Component({
  selector: 'jhi-collateral-update',
  templateUrl: './collateral-update.component.html',
  styleUrls: ['./css/collateral-update.css'],
})
export class CollateralUpdateComponent extends AbstractEntityUpdateComponent<ICollateral> {
  public collateralModel: ICollateral = new Collateral();
  collateraltypes: ICollateralType[] = [];

  parties: IParty[] = [];

  applications: IApplication[] = [];
  collateralTypeId: string;
  partyId: string;
  applicationId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected collateralService: CollateralService,
    protected collateralTypeService: CollateralTypeService,
    protected partyService: PartyService,
    protected applicationService: ApplicationService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, collateralService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'collateralListModification';
  }

  protected initialState(): any {
    return { item: new Collateral(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['collateralTypeId']) {
        this.collateralTypeId = params['collateralTypeId'];
      }
      if (params['partyId']) {
        this.partyId = params['partyId'];
      }
      if (params['applicationId']) {
        this.applicationId = params['applicationId'];
      }
    });

    this.collateralTypeService.loadCacheAll().subscribe((res: ICollateralType[]) => (this.collateraltypes = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.applicationService.loadCacheAll().subscribe((res: IApplication[]) => (this.applications = res || []));
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

  trackCollateralTypeById(index: number, item: ICollateralType) {
    return item.id;
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

  get collateral() {
    return this.item;
  }

  public itemE: ICollateral = new Collateral();

  public saveData(): void {
    console.log('collateral', this.collateral);
    this.collateralService.create(this.collateral).subscribe((res: HttpResponse<ICollateral>) => {
      console.log('result', res);
    });
  }
}
