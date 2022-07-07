import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPartySlik } from './party-slik.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-party-slik-detail',
  templateUrl: './party-slik-detail.component.html',
})
export class PartySlikDetailComponent implements OnInit {
  partySlik: IPartySlik | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partySlik }) => (this.partySlik = partySlik));
  }

  previousState(): void {
    window.history.back();
  }
}
