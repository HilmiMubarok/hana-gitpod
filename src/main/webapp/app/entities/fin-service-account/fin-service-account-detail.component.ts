import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFinServiceAccount } from './fin-service-account.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-fin-service-account-detail',
  templateUrl: './fin-service-account-detail.component.html',
})
export class FinServiceAccountDetailComponent implements OnInit {
  finServiceAccount: IFinServiceAccount | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finServiceAccount }) => (this.finServiceAccount = finServiceAccount));
  }

  previousState(): void {
    window.history.back();
  }
}
