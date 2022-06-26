import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IFacility, Facility } from './facility.model';
import { FacilityService } from './facility.service';
import { IFacilityType, FacilityType } from 'app/entities/facility-type/facility-type.model';
import { FacilityTypeService } from 'app/entities/facility-type/facility-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IFacilityType | IFacility;

@Component({
  selector: 'jhi-facility-update',
  templateUrl: './facility-update.component.html',
})
export class FacilityUpdateComponent extends AbstractEntityUpdateComponent<IFacility> {
  facilitytypes: IFacilityType[] = [];

  facilities: IFacility[] = [];
  facilityTypeId: string;
  partOfId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected facilityService: FacilityService,
    protected facilityTypeService: FacilityTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, facilityService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'facilityListModification';
  }

  protected initialState(): any {
    return { item: new Facility(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['facilityTypeId']) {
        this.facilityTypeId = params['facilityTypeId'];
      }
      if (params['partOfId']) {
        this.partOfId = params['partOfId'];
      }
    });

    this.facilityTypeService.loadCacheAll().subscribe((res: IFacilityType[]) => (this.facilitytypes = res || []));

    this.facilityService.loadCacheAll().subscribe((res: IFacility[]) => (this.facilities = res || []));
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

  trackFacilityTypeById(index: number, item: IFacilityType) {
    return item.id;
  }

  trackFacilityById(index: number, item: IFacility) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get facility() {
    return this.item;
  }
}
