import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICollateralType } from './collateral-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-collateral-type-detail',
  templateUrl: './collateral-type-detail.component.html',
})
export class CollateralTypeDetailComponent implements OnInit {
  collateralType: ICollateralType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ collateralType }) => (this.collateralType = collateralType));
  }

  previousState(): void {
    window.history.back();
  }
}
