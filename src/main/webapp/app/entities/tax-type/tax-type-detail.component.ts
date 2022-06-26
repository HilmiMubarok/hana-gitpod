import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITaxType } from './tax-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-tax-type-detail',
  templateUrl: './tax-type-detail.component.html',
})
export class TaxTypeDetailComponent implements OnInit {
  taxType: ITaxType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ taxType }) => (this.taxType = taxType));
  }

  previousState(): void {
    window.history.back();
  }
}
