import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGLAccountClass } from './gl-account-class.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-gl-account-class-detail',
  templateUrl: './gl-account-class-detail.component.html',
})
export class GLAccountClassDetailComponent implements OnInit {
  gLAccountClass: IGLAccountClass | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gLAccountClass }) => (this.gLAccountClass = gLAccountClass));
  }

  previousState(): void {
    window.history.back();
  }
}
