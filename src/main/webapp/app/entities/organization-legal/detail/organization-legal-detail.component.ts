import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOrganizationLegal } from '../organization-legal.model';

@Component({
  selector: 'jhi-organization-legal-detail',
  templateUrl: './organization-legal-detail.component.html',
})
export class OrganizationLegalDetailComponent implements OnInit {
  organizationLegal: IOrganizationLegal | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationLegal }) => {
      this.organizationLegal = organizationLegal;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
