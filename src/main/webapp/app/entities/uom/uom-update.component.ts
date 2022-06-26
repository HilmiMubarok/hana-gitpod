import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IUom, Uom } from './uom.model';
import { UomService } from './uom.service';
import { IUomType, UomType } from 'app/entities/uom-type/uom-type.model';
import { UomTypeService } from 'app/entities/uom-type/uom-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ReportUtilService } from 'app/shared/base/report-util.service';

@Component({
  selector: 'jhi-uom-update',
  templateUrl: './uom-update.component.html',
})
export class UomUpdateComponent extends AbstractEntityUpdateComponent<IUom> {
  uomtypes: IUomType[] = [];
  uomTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected uomService: UomService,
    protected uomTypeService: UomTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService,
    protected reportUtils: ReportUtilService
  ) {
    super(dataUtils, uomService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'uomListModification';
  }

  protected initialState(): any {
    return { item: new Uom(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['uomTypeId']) {
        this.uomTypeId = params['uomTypeId'];
      }
    });

    this.uomTypeService.loadCacheAll().subscribe((res: IUomType[]) => (this.uomtypes = res || []));
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

  trackUomTypeById(index: number, item: IUomType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get uom() {
    return this.item;
  }

  print() {
    this.reportUtils.viewFile('/api/report/Uom/pdf', {});
    return false;
  }
}
