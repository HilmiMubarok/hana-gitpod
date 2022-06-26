import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGeoBoundaryType } from './geo-boundary-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-geo-boundary-type-detail',
  templateUrl: './geo-boundary-type-detail.component.html',
})
export class GeoBoundaryTypeDetailComponent implements OnInit {
  geoBoundaryType: IGeoBoundaryType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ geoBoundaryType }) => (this.geoBoundaryType = geoBoundaryType));
  }

  previousState(): void {
    window.history.back();
  }
}
