import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganizationFinancial } from './organization-financial.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-organization-financial-detail',
  templateUrl: './organization-financial-detail.component.html',
})
export class OrganizationFinancialDetailComponent implements OnInit {
  organizationFinancial: IOrganizationFinancial | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationFinancial }) => (this.organizationFinancial = organizationFinancial));
  }

  previousState(): void {
    window.history.back();
  }
}
