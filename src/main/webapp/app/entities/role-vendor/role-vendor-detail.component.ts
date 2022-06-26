import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRoleVendor } from './role-vendor.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-role-vendor-detail',
  templateUrl: './role-vendor-detail.component.html',
})
export class RoleVendorDetailComponent implements OnInit {
  roleVendor: IRoleVendor | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roleVendor }) => (this.roleVendor = roleVendor));
  }

  previousState(): void {
    window.history.back();
  }
}
