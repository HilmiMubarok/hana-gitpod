import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICollateralProperty } from './collateral-property.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-collateral-property-detail',
  templateUrl: './collateral-property-detail.component.html',
})
export class CollateralPropertyDetailComponent implements OnInit {
  collateralProperty: ICollateralProperty | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ collateralProperty }) => (this.collateralProperty = collateralProperty));
  }

  previousState(): void {
    window.history.back();
  }
}
