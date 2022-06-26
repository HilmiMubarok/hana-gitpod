import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAcctgTrans } from './acctg-trans.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-acctg-trans-detail',
  templateUrl: './acctg-trans-detail.component.html',
})
export class AcctgTransDetailComponent implements OnInit {
  acctgTrans: IAcctgTrans | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ acctgTrans }) => (this.acctgTrans = acctgTrans));
  }

  previousState(): void {
    window.history.back();
  }
}
