import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInternal } from './internal.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-internal-detail',
  templateUrl: './internal-detail.component.html',
})
export class InternalDetailComponent implements OnInit {
  internal: IInternal | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ internal }) => (this.internal = internal));
  }

  previousState(): void {
    window.history.back();
  }
}
