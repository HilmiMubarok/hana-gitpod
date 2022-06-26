import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISettlementType } from './settlement-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-settlement-type-detail',
  templateUrl: './settlement-type-detail.component.html',
})
export class SettlementTypeDetailComponent implements OnInit {
  settlementType: ISettlementType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ settlementType }) => (this.settlementType = settlementType));
  }

  previousState(): void {
    window.history.back();
  }
}
