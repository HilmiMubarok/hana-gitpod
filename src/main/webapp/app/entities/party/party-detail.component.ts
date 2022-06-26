import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParty } from './party.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-party-detail',
  templateUrl: './party-detail.component.html',
})
export class PartyDetailComponent implements OnInit {
  party: IParty | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ party }) => (this.party = party));
  }

  previousState(): void {
    window.history.back();
  }
}
