import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReceipt } from './receipt.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-receipt-detail',
  templateUrl: './receipt-detail.component.html',
})
export class ReceiptDetailComponent implements OnInit {
  receipt: IReceipt | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ receipt }) => (this.receipt = receipt));
  }

  previousState(): void {
    window.history.back();
  }
}
