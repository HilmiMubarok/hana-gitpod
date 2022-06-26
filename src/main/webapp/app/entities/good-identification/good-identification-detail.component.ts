import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGoodIdentification } from './good-identification.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-good-identification-detail',
  templateUrl: './good-identification-detail.component.html',
})
export class GoodIdentificationDetailComponent implements OnInit {
  goodIdentification: IGoodIdentification | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ goodIdentification }) => (this.goodIdentification = goodIdentification));
  }

  previousState(): void {
    window.history.back();
  }
}
