import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ILoanApplication, LoanApplication } from './loan-application.model';
import { LoanApplicationService } from './loan-application.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IApplicationType, ApplicationType } from 'app/entities/application-type/application-type.model';
import { ApplicationTypeService } from 'app/entities/application-type/application-type.service';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';
import { IProduct, Product } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/product.service';
import { IPerson, Person } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/person.service';

type SelectableEntity = IApplicationType | IInternal | IProduct | IPerson;

@Component({
  selector: 'jhi-loan-application-view',
  templateUrl: './loan-application-view.component.html',
})
export class LoanApplicationViewComponent extends AbstractEntityBaseViewComponent<ILoanApplication> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

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
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(loanApplicationService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new LoanApplication();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new LoanApplication();
        this.loanApplicationService.find(this.id).subscribe(result => {
          this.item = result.body;
          this.prepareView();
        });
      }
    }

    if (changes['item']) {
      if (changes['item'].isFirstChange()) {
        this.initialize();
      }
      if (this.item) {
        this.prepareView();
      }
    }

    if (changes['isSaving'] && this.item.id) {
      if (this.isSaving) {
        this.save();
      }
    }
  }

  initialize() {
    this.applicationTypeService.loadCacheAll().subscribe((res: IApplicationType[]) => (this.applicationtypes = res || []));

    this.internalService.loadCacheAll().subscribe((res: IInternal[]) => (this.internals = res || []));

    this.productService.loadCacheAll().subscribe((res: IProduct[]) => (this.products = res || []));

    this.personService.loadCacheAll().subscribe((res: IPerson[]) => (this.people = res || []));
  }

  prepareView() {}

  get loanApplication() {
    return this.item;
  }

  set loanApplication(loanApplication: ILoanApplication) {
    this.item = loanApplication;
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
    return this.item.id;
  }
}
