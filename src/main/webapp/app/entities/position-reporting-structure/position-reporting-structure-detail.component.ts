import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPositionReportingStructure } from './position-reporting-structure.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-position-reporting-structure-detail',
  templateUrl: './position-reporting-structure-detail.component.html',
})
export class PositionReportingStructureDetailComponent implements OnInit {
  positionReportingStructure: IPositionReportingStructure | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ positionReportingStructure }) => (this.positionReportingStructure = positionReportingStructure));
  }

  previousState(): void {
    window.history.back();
  }
}
