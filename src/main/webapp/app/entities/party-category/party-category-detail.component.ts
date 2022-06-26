import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPartyCategory } from './party-category.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-party-category-detail',
  templateUrl: './party-category-detail.component.html',
})
export class PartyCategoryDetailComponent implements OnInit {
  partyCategory: IPartyCategory | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partyCategory }) => (this.partyCategory = partyCategory));
  }

  previousState(): void {
    window.history.back();
  }
}
