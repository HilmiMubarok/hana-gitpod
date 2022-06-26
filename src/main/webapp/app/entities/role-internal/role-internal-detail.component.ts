import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRoleInternal } from './role-internal.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-role-internal-detail',
  templateUrl: './role-internal-detail.component.html',
})
export class RoleInternalDetailComponent implements OnInit {
  roleInternal: IRoleInternal | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roleInternal }) => (this.roleInternal = roleInternal));
  }

  previousState(): void {
    window.history.back();
  }
}
