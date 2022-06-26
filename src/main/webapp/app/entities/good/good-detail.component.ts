import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGood } from './good.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-good-detail',
  templateUrl: './good-detail.component.html',
})
export class GoodDetailComponent implements OnInit {
  good: IGood | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ good }) => (this.good = good));
  }

  previousState(): void {
    window.history.back();
  }
}
