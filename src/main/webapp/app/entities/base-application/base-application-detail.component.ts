import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBaseApplication } from './base-application.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-base-application-detail',
  templateUrl: './base-application-detail.component.html',
})
export class BaseApplicationDetailComponent implements OnInit {
  baseApplication: IBaseApplication | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ baseApplication }) => (this.baseApplication = baseApplication));
  }

  previousState(): void {
    window.history.back();
  }
}
