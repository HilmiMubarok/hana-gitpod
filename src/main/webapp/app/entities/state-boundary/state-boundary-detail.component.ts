import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStateBoundary } from './state-boundary.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-state-boundary-detail',
  templateUrl: './state-boundary-detail.component.html',
})
export class StateBoundaryDetailComponent implements OnInit {
  stateBoundary: IStateBoundary | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stateBoundary }) => (this.stateBoundary = stateBoundary));
  }

  previousState(): void {
    window.history.back();
  }
}
