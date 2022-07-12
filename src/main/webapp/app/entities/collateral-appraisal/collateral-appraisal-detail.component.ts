import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICollateralAppraisal } from './collateral-appraisal.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-collateral-appraisal-detail',
  templateUrl: './collateral-appraisal-detail.component.html',
})
export class CollateralAppraisalDetailComponent implements OnInit {
  collateralAppraisal: ICollateralAppraisal | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ collateralAppraisal }) => (this.collateralAppraisal = collateralAppraisal));
  }

  previousState(): void {
    window.history.back();
  }
}
