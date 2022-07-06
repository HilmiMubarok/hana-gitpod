import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICollateral } from './collateral.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-collateral-detail',
  templateUrl: './collateral-detail.component.html',
})
export class CollateralDetailComponent implements OnInit {
  collateral: ICollateral | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ collateral }) => (this.collateral = collateral));
  }

  previousState(): void {
    window.history.back();
  }
}
