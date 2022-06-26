import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFeatureType } from './feature-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-feature-type-detail',
  templateUrl: './feature-type-detail.component.html',
})
export class FeatureTypeDetailComponent implements OnInit {
  featureType: IFeatureType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ featureType }) => (this.featureType = featureType));
  }

  previousState(): void {
    window.history.back();
  }
}
