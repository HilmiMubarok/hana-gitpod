import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICustomerInfo } from '../customer-info.model';
import { CustomerInfoService } from '../service/customer-info.service';
import { CustomerInfoDeleteDialogComponent } from '../delete/customer-info-delete-dialog.component';

@Component({
  selector: 'jhi-customer-info',
  templateUrl: './customer-info.component.html',
})
export class CustomerInfoComponent implements OnInit {
  customerInfos?: ICustomerInfo[];
  isLoading = false;
  currentSearch: string;

  constructor(
    protected customerInfoService: CustomerInfoService,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute
  ) {
    this.currentSearch = this.activatedRoute.snapshot.queryParams['search'] ?? '';
  }

  loadAll(): void {
    this.isLoading = true;
    if (this.currentSearch) {
      this.customerInfoService
        .search({
          query: this.currentSearch,
        })
        .subscribe({
          next: (res: HttpResponse<ICustomerInfo[]>) => {
            this.isLoading = false;
            this.customerInfos = res.body ?? [];
          },
          error: () => {
            this.isLoading = false;
          },
        });
      return;
    }

    this.customerInfoService.query().subscribe({
      next: (res: HttpResponse<ICustomerInfo[]>) => {
        this.isLoading = false;
        this.customerInfos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  search(query: string): void {
    this.currentSearch = query;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICustomerInfo): number {
    return item.id!;
  }

  delete(customerInfo: ICustomerInfo): void {
    const modalRef = this.modalService.open(CustomerInfoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.customerInfo = customerInfo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
