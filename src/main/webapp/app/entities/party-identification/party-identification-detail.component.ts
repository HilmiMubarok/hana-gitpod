import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPartyIdentification } from './party-identification.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-party-identification-detail',
  templateUrl: './party-identification-detail.component.html',
})
export class PartyIdentificationDetailComponent implements OnInit {
  partyIdentification: IPartyIdentification | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partyIdentification }) => (this.partyIdentification = partyIdentification));
  }

  previousState(): void {
    window.history.back();
  }
}
