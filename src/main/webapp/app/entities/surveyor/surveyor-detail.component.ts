import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISurveyor } from './surveyor.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-surveyor-detail',
  templateUrl: './surveyor-detail.component.html',
})
export class SurveyorDetailComponent implements OnInit {
  surveyor: ISurveyor | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ surveyor }) => (this.surveyor = surveyor));
  }

  previousState(): void {
    window.history.back();
  }
}
