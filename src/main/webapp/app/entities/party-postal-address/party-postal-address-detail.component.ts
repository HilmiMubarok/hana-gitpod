import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPartyPostalAddress } from './party-postal-address.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-party-postal-address-detail',
  templateUrl: './party-postal-address-detail.component.html',
})
export class PartyPostalAddressDetailComponent implements OnInit {
  partyPostalAddress: IPartyPostalAddress | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partyPostalAddress }) => (this.partyPostalAddress = partyPostalAddress));
  }

  previousState(): void {
    window.history.back();
  }
}
