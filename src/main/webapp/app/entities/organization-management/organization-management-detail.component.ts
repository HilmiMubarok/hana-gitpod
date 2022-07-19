import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganizationManagement } from './organization-management.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-organization-management-detail',
  templateUrl: './organization-management-detail.component.html',
})
export class OrganizationManagementDetailComponent implements OnInit {
  organizationManagement: IOrganizationManagement | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationManagement }) => (this.organizationManagement = organizationManagement));
    console.log(JSON.stringify(this.organizationManagement, null, 2));
  }

  previousState(): void {
    window.history.back();
  }
}
