import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGLResourceType } from './gl-resource-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-gl-resource-type-detail',
  templateUrl: './gl-resource-type-detail.component.html',
})
export class GLResourceTypeDetailComponent implements OnInit {
  gLResourceType: IGLResourceType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gLResourceType }) => (this.gLResourceType = gLResourceType));
  }

  previousState(): void {
    window.history.back();
  }
}
