import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccountBalanced } from './account-balanced.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-account-balanced-detail',
  templateUrl: './account-balanced-detail.component.html',
})
export class AccountBalancedDetailComponent implements OnInit {
  accountBalanced: IAccountBalanced | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountBalanced }) => (this.accountBalanced = accountBalanced));
  }

  previousState(): void {
    window.history.back();
  }
}
