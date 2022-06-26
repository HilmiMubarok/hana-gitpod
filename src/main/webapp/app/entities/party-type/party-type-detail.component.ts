import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPartyType } from './party-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-party-type-detail',
  templateUrl: './party-type-detail.component.html',
})
export class PartyTypeDetailComponent implements OnInit {
  partyType: IPartyType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partyType }) => (this.partyType = partyType));
  }

  previousState(): void {
    window.history.back();
  }
}
