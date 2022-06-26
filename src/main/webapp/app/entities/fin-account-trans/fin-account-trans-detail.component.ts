import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFinAccountTrans } from './fin-account-trans.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-fin-account-trans-detail',
  templateUrl: './fin-account-trans-detail.component.html',
})
export class FinAccountTransDetailComponent implements OnInit {
  finAccountTrans: IFinAccountTrans | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ finAccountTrans }) => (this.finAccountTrans = finAccountTrans));
  }

  previousState(): void {
    window.history.back();
  }
}
