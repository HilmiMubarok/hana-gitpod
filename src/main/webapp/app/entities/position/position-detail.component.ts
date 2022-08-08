import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPosition } from './position.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-position-detail',
  templateUrl: './position-detail.component.html',
})
export class PositionDetailComponent implements OnInit {
  position: IPosition | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ position }) => (this.position = position));
  }

  previousState(): void {
    window.history.back();
  }
}
