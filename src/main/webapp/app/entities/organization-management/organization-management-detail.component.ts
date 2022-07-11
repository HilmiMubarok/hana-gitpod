import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganizationManagement } from './organization-management.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
// import { dataSource } from './datasource';

@Component({
  selector: 'jhi-organization-management-detail',
  templateUrl: './organization-management-detail.component.html',
})
export class OrganizationManagementDetailComponent implements OnInit {
  organizationManagement: IOrganizationManagement | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    // console.log(this.activatedRoute.url);
    this.activatedRoute.data.subscribe(({ organizationManagement }) => (this.organizationManagement = organizationManagement));
  }

  previousState(): void {
    window.history.back();
  }
}
