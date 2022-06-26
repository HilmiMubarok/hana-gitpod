import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBaseAccount } from './base-account.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-base-account-detail',
  templateUrl: './base-account-detail.component.html',
})
export class BaseAccountDetailComponent implements OnInit {
  baseAccount: IBaseAccount | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ baseAccount }) => (this.baseAccount = baseAccount));
  }

  previousState(): void {
    window.history.back();
  }
}
