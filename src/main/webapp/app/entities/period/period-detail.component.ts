import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPeriod } from './period.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-period-detail',
  templateUrl: './period-detail.component.html',
})
export class PeriodDetailComponent implements OnInit {
  period: IPeriod | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ period }) => (this.period = period));
  }

  previousState(): void {
    window.history.back();
  }
}
