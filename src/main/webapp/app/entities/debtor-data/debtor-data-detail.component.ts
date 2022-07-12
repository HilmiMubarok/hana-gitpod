import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDebtorData } from './debtor-data.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-debtor-data-detail',
  templateUrl: './debtor-data-detail.component.html',
})
export class DebtorDataDetailComponent implements OnInit {
  debtorData: IDebtorData | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ debtorData }) => (this.debtorData = debtorData));
  }

  previousState(): void {
    window.history.back();
  }
}
