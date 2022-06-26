import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGeoBoundary } from './geo-boundary.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-geo-boundary-detail',
  templateUrl: './geo-boundary-detail.component.html',
})
export class GeoBoundaryDetailComponent implements OnInit {
  geoBoundary: IGeoBoundary | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ geoBoundary }) => (this.geoBoundary = geoBoundary));
  }

  previousState(): void {
    window.history.back();
  }
}
