import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFinancingRequest } from './financing-request.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-financing-request-detail',
  templateUrl: './financing-request-detail.component.html',
})
export class FinancingRequestDetailComponent implements OnInit {
  financingRequest: IFinancingRequest | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ financingRequest }) => (this.financingRequest = financingRequest));
  }

  previousState(): void {
    window.history.back();
  }
}
