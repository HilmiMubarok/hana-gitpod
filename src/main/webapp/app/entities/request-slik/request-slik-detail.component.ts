import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRequestSlik } from './request-slik.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-request-slik-detail',
  templateUrl: './request-slik-detail.component.html',
})
export class RequestSlikDetailComponent implements OnInit {
  requestSlik: IRequestSlik | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ requestSlik }) => (this.requestSlik = requestSlik));
  }

  previousState(): void {
    window.history.back();
  }
}
