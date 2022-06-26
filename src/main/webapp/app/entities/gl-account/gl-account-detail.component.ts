import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGLAccount } from './gl-account.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-gl-account-detail',
  templateUrl: './gl-account-detail.component.html',
})
export class GLAccountDetailComponent implements OnInit {
  gLAccount: IGLAccount | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gLAccount }) => (this.gLAccount = gLAccount));
  }

  previousState(): void {
    window.history.back();
  }
}
