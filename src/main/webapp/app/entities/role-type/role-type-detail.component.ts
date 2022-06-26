import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRoleType } from './role-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-role-type-detail',
  templateUrl: './role-type-detail.component.html',
})
export class RoleTypeDetailComponent implements OnInit {
  roleType: IRoleType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roleType }) => (this.roleType = roleType));
  }

  previousState(): void {
    window.history.back();
  }
}
