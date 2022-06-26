import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IUomConversion, UomConversion } from './uom-conversion.model';
import { UomConversionService } from './uom-conversion.service';
import { IUom, Uom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

@Component({
  selector: 'jhi-uom-conversion-update',
  templateUrl: './uom-conversion-update.component.html',
})
export class UomConversionUpdateComponent extends AbstractEntityUpdateComponent<IUomConversion> {
  uoms: IUom[] = [];
  uomToId: string;
  uomFromId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected uomConversionService: UomConversionService,
    protected uomService: UomService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, uomConversionService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'uomConversionListModification';
  }

  protected initialState(): any {
    return { item: new UomConversion(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['uomToId']) {
        this.uomToId = params['uomToId'];
      }
      if (params['uomFromId']) {
        this.uomFromId = params['uomFromId'];
      }
    });

    this.uomService.loadCacheAll().subscribe((res: IUom[]) => (this.uoms = res || []));
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

  trackUomById(index: number, item: IUom) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get uomConversion() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/UomConversion/pdf', {});
    return false;
  }
}
