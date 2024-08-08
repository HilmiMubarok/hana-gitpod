import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IFuncSettingTemplate, FuncSettingTemplate } from './func-setting-template.model';
import { FuncSettingTemplateService } from './func-setting-template.service';
import { IProductType, ProductType } from 'app/entities/product-type/product-type.model';
import { ProductTypeService } from 'app/entities/product-type/product-type.service';
import { IFeature, Feature } from 'app/entities/feature/feature.model';
import { FeatureService } from 'app/entities/feature/feature.service';
import { IFuncSetting, FuncSetting } from 'app/entities/func-setting/func-setting.model';
import { FuncSettingService } from 'app/entities/func-setting/func-setting.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IProductType | IFeature | IFuncSetting;

@Component({
  selector: 'jhi-func-setting-template-update',
  templateUrl: './func-setting-template-update.component.html',
})
export class FuncSettingTemplateUpdateComponent extends AbstractEntityUpdateComponent<IFuncSettingTemplate> {
  producttypes: IProductType[] = [];

  features: IFeature[] = [];

  funcsettings: IFuncSetting[] = [];
  productTypeId: string;
  featureItems: IFeature[];
  featureSelect: IFeature;
  featureId: string;
  funcSettingId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected funcSettingTemplateService: FuncSettingTemplateService,
    protected productTypeService: ProductTypeService,
    protected featureService: FeatureService,
    protected funcSettingService: FuncSettingService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, funcSettingTemplateService, elementRef, confirmationService, toastService, activatedRoute);
    this.featureSelect = new Feature();
    this.listChangeEventName = 'funcSettingTemplateListModification';
  }

  protected initialState(): any {
    return { item: new FuncSettingTemplate(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['productTypeId']) {
        this.productTypeId = params['productTypeId'];
      }
      if (params['featureId']) {
        this.featureId = params['featureId'];
      }
      if (params['funcSettingId']) {
        this.funcSettingId = params['funcSettingId'];
      }
    });

    this.productTypeService.loadCacheAll().subscribe((res: IProductType[]) => (this.producttypes = res || []));

    this.featureService.loadCacheAll().subscribe((res: IFeature[]) => (this.features = res || []));

    this.funcSettingService.loadCacheAll().subscribe((res: IFuncSetting[]) => (this.funcsettings = res || []));
  }

  protected loadRelatedEntityEffect(state: any): Observable<any> {
    const result = of(state).pipe(
      mergeMap(currState =>
        this.featureService.find(state.item.featureId).pipe(
          map(res => res.body),
          catchError(res => of(new Feature())),
          map(res => {
            this.featureSelect = res;
            return currState;
          })
        )
      )
    );
    return result;
  }

  protected buildDependencyEffect(state: any): Observable<any> {
    return of(state);
  }

  protected prepareSaveEffect(state: any): Observable<any> {
    return of(state);
  }

  trackProductTypeById(index: number, item: IProductType) {
    return item.id;
  }

  trackFuncSettingById(index: number, item: IFuncSetting) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get funcSettingTemplate() {
    return this.item;
  }

  searchfeature(event: any) {
    this.featureService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IFeature[]>) => {
      this.featureItems = res.body;
    });
  }

  selectfeature(value: any) {
    this.item.featureId = this.featureSelect.id;
  }
}
