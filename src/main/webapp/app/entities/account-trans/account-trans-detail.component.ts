import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccountTrans } from './account-trans.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-account-trans-detail',
  templateUrl: './account-trans-detail.component.html',
})
export class AccountTransDetailComponent implements OnInit {
  accountTrans: IAccountTrans | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountTrans }) => (this.accountTrans = accountTrans));
  }

  previousState(): void {
    window.history.back();
  }
}
