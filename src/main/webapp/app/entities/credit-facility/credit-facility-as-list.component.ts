import { Component, ViewChild, ElementRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { ICreditFacility } from './credit-facility.model';
import { CreditFacilityService } from './credit-facility.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityAsListComponent } from 'app/shared/base/abstract-entity-as-list.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { EventManager } from 'app/core/util/event-manager.service';

@Component({
  selector: 'jhi-credit-facility-as-list',
  templateUrl: './credit-facility-as-list.component.html',
})
export class CreditFacilityAsListComponent extends AbstractEntityAsListComponent<ICreditFacility> implements OnChanges {
  @Input() filterName: string;
  @Input() idProductType: any;

  constructor(
    protected creditFacilityService: CreditFacilityService,
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
      creditFacilityService,
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

    this.listChangeEventName = 'creditFacilityListModification';
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
    this.creditFacilityService.queryFilterBy(queryParams).subscribe(
      (res: HttpResponse<ICreditFacility[]>) => this.paginateItems(res.body, res.headers),
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idProductType']) {
      this.loadAll();
    }
  }

  trackId(index: number, item: ICreditFacility) {
    return item.id;
  }

  get creditFacilities() {
    return this.items;
  }

  set creditFacilities(creditFacility: ICreditFacility[]) {
    this.items = creditFacility;
  }

  addNewData() {
    const queryParams: any = {};
    if (this.filterName) {
      queryParams.filterName = this.filterName;
    }
    if (this.idProductType) {
      queryParams.productTypeId = this.idProductType;
    }
    this.router.navigate(['credit-facility/new', queryParams]);
  }

  onEditComplete(event: any) {
    this.creditFacilityService.update(event.data).subscribe(() => {
      this.messageService.add({ severity: 'info', summary: 'Data Updated', detail: 'Data updated...' });
      this.eventManager.broadcast({
        name: this.listChangeEventName,
        content: 'Completed an item',
      });
    });
  }
}
