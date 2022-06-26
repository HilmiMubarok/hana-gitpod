import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { ILoanApplication, LoanApplication } from './loan-application.model';
import { LoanApplicationService } from './loan-application.service';
import { IApplicationType, ApplicationType } from 'app/entities/application-type/application-type.model';
import { ApplicationTypeService } from 'app/entities/application-type/application-type.service';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { IPerson, Person } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/person.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IApplicationType | IInternal | IProduct | IPerson;

@Component({
  selector: 'jhi-loan-application-update',
  templateUrl: './loan-application-update.component.html',
})
export class LoanApplicationUpdateComponent extends AbstractEntityUpdateComponent<ILoanApplication> {
  applicationtypes: IApplicationType[] = [];

  internals: IInternal[] = [];

  products: IProduct[] = [];

  people: IPerson[] = [];
  applicationTypeId: string;
  internalId: string;
  financialProductId: number;
  prospectId: string;
  spouseId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected loanApplicationService: LoanApplicationService,
    protected applicationTypeService: ApplicationTypeService,
    protected internalService: InternalService,
    protected productService: ProductService,
    protected personService: PersonService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, loanApplicationService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'loanApplicationListModification';
  }

  protected initialState(): any {
    return { item: new LoanApplication(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['applicationTypeId']) {
        this.applicationTypeId = params['applicationTypeId'];
      }
      if (params['internalId']) {
        this.internalId = params['internalId'];
      }
      if (params['financialProductId']) {
        this.financialProductId = params['financialProductId'];
      }
      if (params['prospectId']) {
        this.prospectId = params['prospectId'];
      }
      if (params['spouseId']) {
        this.spouseId = params['spouseId'];
      }
    });

    this.applicationTypeService.loadCacheAll().subscribe((res: IApplicationType[]) => (this.applicationtypes = res || []));

    this.internalService.loadCacheAll().subscribe((res: IInternal[]) => (this.internals = res || []));

    this.productService.loadCacheAll().subscribe((res: IProduct[]) => (this.products = res || []));

    this.personService.loadCacheAll().subscribe((res: IPerson[]) => (this.people = res || []));
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

  trackApplicationTypeById(index: number, item: IApplicationType) {
    return item.id;
  }

  trackInternalById(index: number, item: IInternal) {
    return item.id;
  }

  trackProductById(index: number, item: IProduct) {
    return item.id;
  }

  trackPersonById(index: number, item: IPerson) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get loanApplication() {
    return this.item;
  }

  readOnly(): boolean {
      return this.item.statusCode !== '_NA_';
  }
}
