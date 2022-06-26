import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IFeature, Feature } from './feature.model';
import { FeatureService } from './feature.service';
import { IFeatureType, FeatureType } from 'app/entities/feature-type/feature-type.model';
import { FeatureTypeService } from 'app/entities/feature-type/feature-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

type SelectableEntity = IFeatureType | IFeature;

@Component({
  selector: 'jhi-feature-update',
  templateUrl: './feature-update.component.html',
})
export class FeatureUpdateComponent extends AbstractEntityUpdateComponent<IFeature> {
  featuretypes: IFeatureType[] = [];

  features: IFeature[] = [];
  featureTypeId: string;
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected featureService: FeatureService,
    protected featureTypeService: FeatureTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, featureService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'featureListModification';
  }

  protected initialState(): any {
    return { item: new Feature(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['featureTypeId']) {
        this.featureTypeId = params['featureTypeId'];
      }
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
    });

    this.featureTypeService.loadCacheAll().subscribe((res: IFeatureType[]) => (this.featuretypes = res || []));

    this.featureService.loadCacheAll().subscribe((res: IFeature[]) => (this.features = res || []));
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

  trackFeatureTypeById(index: number, item: IFeatureType) {
    return item.id;
  }

  trackFeatureById(index: number, item: IFeature) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get feature() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/Feature/pdf', {});
    return false;
  }
}
