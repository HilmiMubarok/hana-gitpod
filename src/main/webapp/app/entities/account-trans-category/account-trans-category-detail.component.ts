import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccountTransCategory } from './account-trans-category.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-account-trans-category-detail',
  templateUrl: './account-trans-category-detail.component.html',
})
export class AccountTransCategoryDetailComponent implements OnInit {
  accountTransCategory: IAccountTransCategory | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountTransCategory }) => (this.accountTransCategory = accountTransCategory));
  }

  previousState(): void {
    window.history.back();
  }
}
