import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFinAccount } from './fin-account.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-fin-account-detail',
  templateUrl: './fin-account-detail.component.html',
})
export class FinAccountDetailComponent implements OnInit {
  finAccount: IFinAccount | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finAccount }) => (this.finAccount = finAccount));
  }

  previousState(): void {
    window.history.back();
  }
}
