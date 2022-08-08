import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPositionType } from './position-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-position-type-detail',
  templateUrl: './position-type-detail.component.html',
})
export class PositionTypeDetailComponent implements OnInit {
  positionType: IPositionType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ positionType }) => (this.positionType = positionType));
  }

  previousState(): void {
    window.history.back();
  }
}
