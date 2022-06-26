import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganizationCustomer } from './organization-customer.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-organization-customer-detail',
  templateUrl: './organization-customer-detail.component.html',
})
export class OrganizationCustomerDetailComponent implements OnInit {
  organizationCustomer: IOrganizationCustomer | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationCustomer }) => (this.organizationCustomer = organizationCustomer));
  }

  previousState(): void {
    window.history.back();
  }
}
