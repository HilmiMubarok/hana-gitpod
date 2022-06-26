import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPersonalCustomer } from './personal-customer.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-personal-customer-detail',
  templateUrl: './personal-customer-detail.component.html',
})
export class PersonalCustomerDetailComponent implements OnInit {
  personalCustomer: IPersonalCustomer | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ personalCustomer }) => (this.personalCustomer = personalCustomer));
  }

  previousState(): void {
    window.history.back();
  }
}
