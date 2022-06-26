import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIdentificationType } from './identification-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-identification-type-detail',
  templateUrl: './identification-type-detail.component.html',
})
export class IdentificationTypeDetailComponent implements OnInit {
  identificationType: IIdentificationType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ identificationType }) => (this.identificationType = identificationType));
  }

  previousState(): void {
    window.history.back();
  }
}
