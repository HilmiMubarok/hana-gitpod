import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISettlement } from './settlement.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-settlement-detail',
  templateUrl: './settlement-detail.component.html',
})
export class SettlementDetailComponent implements OnInit {
  settlement: ISettlement | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ settlement }) => (this.settlement = settlement));
  }

  previousState(): void {
    window.history.back();
  }
}
