import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISurveyBatch } from './survey-batch.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-survey-batch-detail',
  templateUrl: './survey-batch-detail.component.html',
})
export class SurveyBatchDetailComponent implements OnInit {
  surveyBatch: ISurveyBatch | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ surveyBatch }) => (this.surveyBatch = surveyBatch));
  }

  previousState(): void {
    window.history.back();
  }
}
