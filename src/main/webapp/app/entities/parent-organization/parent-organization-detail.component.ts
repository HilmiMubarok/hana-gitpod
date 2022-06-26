import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParentOrganization } from './parent-organization.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-parent-organization-detail',
  templateUrl: './parent-organization-detail.component.html',
})
export class ParentOrganizationDetailComponent implements OnInit {
  parentOrganization: IParentOrganization | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parentOrganization }) => (this.parentOrganization = parentOrganization));
  }

  previousState(): void {
    window.history.back();
  }
}
