import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGLAccountType } from './gl-account-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-gl-account-type-detail',
  templateUrl: './gl-account-type-detail.component.html',
})
export class GLAccountTypeDetailComponent implements OnInit {
  gLAccountType: IGLAccountType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gLAccountType }) => (this.gLAccountType = gLAccountType));
  }

  previousState(): void {
    window.history.back();
  }
}
