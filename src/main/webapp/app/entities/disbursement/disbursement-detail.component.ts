import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDisbursement } from './disbursement.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-disbursement-detail',
  templateUrl: './disbursement-detail.component.html',
})
export class DisbursementDetailComponent implements OnInit {
  disbursement: IDisbursement | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ disbursement }) => (this.disbursement = disbursement));
  }

  previousState(): void {
    window.history.back();
  }
}
