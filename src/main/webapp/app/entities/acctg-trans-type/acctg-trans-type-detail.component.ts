import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAcctgTransType } from './acctg-trans-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-acctg-trans-type-detail',
  templateUrl: './acctg-trans-type-detail.component.html',
})
export class AcctgTransTypeDetailComponent implements OnInit {
  acctgTransType: IAcctgTransType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ acctgTransType }) => (this.acctgTransType = acctgTransType));
  }

  previousState(): void {
    window.history.back();
  }
}
