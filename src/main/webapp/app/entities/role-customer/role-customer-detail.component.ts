import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRoleCustomer } from './role-customer.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-role-customer-detail',
  templateUrl: './role-customer-detail.component.html',
})
export class RoleCustomerDetailComponent implements OnInit {
  roleCustomer: IRoleCustomer | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ roleCustomer }) => (this.roleCustomer = roleCustomer));
  }

  previousState(): void {
    window.history.back();
  }
}
