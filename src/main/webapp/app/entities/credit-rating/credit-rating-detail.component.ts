import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICreditRating } from './credit-rating.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-credit-rating-detail',
  templateUrl: './credit-rating-detail.component.html',
})
export class CreditRatingDetailComponent implements OnInit {
  creditRating: ICreditRating | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditRating }) => (this.creditRating = creditRating));
  }

  previousState(): void {
    window.history.back();
  }
}
