import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IFuncSettingAppl, FuncSettingAppl } from './func-setting-appl.model';
import { FuncSettingApplService } from './func-setting-appl.service';
import { IFeatureApplicable, FeatureApplicable } from 'app/entities/feature-applicable/feature-applicable.model';
import { FeatureApplicableService } from 'app/entities/feature-applicable/feature-applicable.service';
import { IFuncSetting, FuncSetting } from 'app/entities/func-setting/func-setting.model';
import { FuncSettingService } from 'app/entities/func-setting/func-setting.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IFeatureApplicable | IFuncSetting;

@Component({
  selector: 'jhi-func-setting-appl-update',
  templateUrl: './func-setting-appl-update.component.html',
})
export class FuncSettingApplUpdateComponent extends AbstractEntityUpdateComponent<IFuncSettingAppl> {
  featureapplicables: IFeatureApplicable[] = [];

  funcsettings: IFuncSetting[] = [];
  featureApplicableItems: IFeatureApplicable[];
  featureApplicableSelect: IFeatureApplicable;
  featureApplicableId: number;
  funcSettingId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected funcSettingApplService: FuncSettingApplService,
    protected featureApplicableService: FeatureApplicableService,
    protected funcSettingService: FuncSettingService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, funcSettingApplService, elementRef, confirmationService, toastService, activatedRoute);
    this.featureApplicableSelect = new FeatureApplicable();
    this.listChangeEventName = 'funcSettingApplListModification';
  }

  protected initialState(): any {
    return { item: new FuncSettingAppl(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['featureApplicableId']) {
        this.featureApplicableId = params['featureApplicableId'];
      }
      if (params['funcSettingId']) {
        this.funcSettingId = params['funcSettingId'];
      }
    });

    this.featureApplicableService.loadCacheAll().subscribe((res: IFeatureApplicable[]) => (this.featureapplicables = res || []));

    this.funcSettingService.loadCacheAll().subscribe((res: IFuncSetting[]) => (this.funcsettings = res || []));
  }

  protected loadRelatedEntityEffect(state: any): Observable<any> {
    const result = of(state).pipe(
      mergeMap(currState =>
        this.featureApplicableService.find(state.item.featureApplicableId).pipe(
          map(res => res.body),
          catchError(res => of(new FeatureApplicable())),
          map(res => {
            this.featureApplicableSelect = res;
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

  trackFuncSettingById(index: number, item: IFuncSetting) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get funcSettingAppl() {
    return this.item;
  }

  searchfeatureApplicable(event: any) {
    this.featureApplicableService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IFeatureApplicable[]>) => {
      this.featureApplicableItems = res.body;
    });
  }

  selectfeatureApplicable(value: any) {
    this.item.featureApplicableId = this.featureApplicableSelect.id;
  }
}
