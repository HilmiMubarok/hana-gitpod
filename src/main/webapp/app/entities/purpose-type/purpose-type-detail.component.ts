import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPurposeType } from './purpose-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-purpose-type-detail',
  templateUrl: './purpose-type-detail.component.html',
})
export class PurposeTypeDetailComponent implements OnInit {
  purposeType: IPurposeType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purposeType }) => (this.purposeType = purposeType));
  }

  previousState(): void {
    window.history.back();
  }
}
