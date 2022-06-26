import { Component, ViewChild, ElementRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { IFinancialProduct } from './financial-product.model';
import { FinancialProductService } from './financial-product.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityAsListComponent } from 'app/shared/base/abstract-entity-as-list.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { EventManager } from 'app/core/util/event-manager.service';

@Component({
  selector: 'jhi-financial-product-as-list',
  templateUrl: './financial-product-as-list.component.html',
})
export class FinancialProductAsListComponent extends AbstractEntityAsListComponent<IFinancialProduct> implements OnChanges {
  @Input() filterName: string;
  @Input() idProductType: any;

  constructor(
    protected financialProductService: FinancialProductService,
    protected parseLinks: ParseLinks,
    protected alertService: AlertService,
    public accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: BaseDataUtils,
    protected router: Router,
    protected eventManager: EventManager,
    protected messageService: MessageService,
    protected confirmationService: ConfirmationService
  ) {
    super(
      financialProductService,
      parseLinks,
      alertService,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );

    this.listChangeEventName = 'financialProductListModification';
    this.entityKeyName = 'id';
    this.predicate = 'id';
  }

  protected loadAllFilterBy() {
    const queryParams: any = { page: this.page - 1, size: this.itemsPerPage, sort: this.sort() };
    if (this.filterName) {
      queryParams.filterName = this.filterName;
    }
    if (this.idProductType) {
      queryParams.idProductType = this.idProductType;
    }
    this.financialProductService.queryFilterBy(queryParams).subscribe(
      (res: HttpResponse<IFinancialProduct[]>) => this.paginateItems(res.body, res.headers),
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idProductType']) {
      this.loadAll();
    }
  }

  trackId(index: number, item: IFinancialProduct) {
    return item.id;
  }

  get financialProducts() {
    return this.items;
  }

  set financialProducts(financialProduct: IFinancialProduct[]) {
    this.items = financialProduct;
  }

  addNewData() {
    const queryParams: any = {};
    if (this.filterName) {
      queryParams.filterName = this.filterName;
    }
    if (this.idProductType) {
      queryParams.productTypeId = this.idProductType;
    }
    this.router.navigate(['financial-product/new', queryParams]);
  }

  onEditComplete(event: any) {
    this.financialProductService.update(event.data).subscribe(() => {
      this.messageService.add({ severity: 'info', summary: 'Data Updated', detail: 'Data updated...' });
      this.eventManager.broadcast({
        name: this.listChangeEventName,
        content: 'Completed an item',
      });
    });
  }
}
