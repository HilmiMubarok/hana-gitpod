import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAcctgTransItem } from './acctg-trans-item.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-acctg-trans-item-detail',
  templateUrl: './acctg-trans-item-detail.component.html',
})
export class AcctgTransItemDetailComponent implements OnInit {
  acctgTransItem: IAcctgTransItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ acctgTransItem }) => (this.acctgTransItem = acctgTransItem));
  }

  previousState(): void {
    window.history.back();
  }
}
