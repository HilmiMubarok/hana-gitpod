import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPartyPaymentPref } from './party-payment-pref.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-party-payment-pref-detail',
  templateUrl: './party-payment-pref-detail.component.html',
})
export class PartyPaymentPrefDetailComponent implements OnInit {
  partyPaymentPref: IPartyPaymentPref | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partyPaymentPref }) => (this.partyPaymentPref = partyPaymentPref));
  }

  previousState(): void {
    window.history.back();
  }
}
