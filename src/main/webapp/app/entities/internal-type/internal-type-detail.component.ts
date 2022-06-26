import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInternalType } from './internal-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-internal-type-detail',
  templateUrl: './internal-type-detail.component.html',
})
export class InternalTypeDetailComponent implements OnInit {
  internalType: IInternalType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ internalType }) => (this.internalType = internalType));
  }

  previousState(): void {
    window.history.back();
  }
}
