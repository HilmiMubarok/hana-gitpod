import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFeatureApplicable } from './feature-applicable.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-feature-applicable-detail',
  templateUrl: './feature-applicable-detail.component.html',
})
export class FeatureApplicableDetailComponent implements OnInit {
  featureApplicable: IFeatureApplicable | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ featureApplicable }) => (this.featureApplicable = featureApplicable));
  }

  previousState(): void {
    window.history.back();
  }
}
