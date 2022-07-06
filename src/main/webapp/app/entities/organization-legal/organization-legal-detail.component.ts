import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganizationLegal } from './organization-legal.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-organization-legal-detail',
  templateUrl: './organization-legal-detail.component.html',
})
export class OrganizationLegalDetailComponent implements OnInit {
  organizationLegal: IOrganizationLegal | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationLegal }) => (this.organizationLegal = organizationLegal));
  }

  previousState(): void {
    window.history.back();
  }
}
