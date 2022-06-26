import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccountTransType } from './account-trans-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-account-trans-type-detail',
  templateUrl: './account-trans-type-detail.component.html',
})
export class AccountTransTypeDetailComponent implements OnInit {
  accountTransType: IAccountTransType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountTransType }) => (this.accountTransType = accountTransType));
  }

  previousState(): void {
    window.history.back();
  }
}
