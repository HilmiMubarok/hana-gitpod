import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganizationManagement } from '../organization-management.model';

@Component({
  selector: 'jhi-organization-management-detail',
  templateUrl: './organization-management-detail.component.html',
})
export class OrganizationManagementDetailComponent implements OnInit {
  organizationManagement: IOrganizationManagement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationManagement }) => {
      this.organizationManagement = organizationManagement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
