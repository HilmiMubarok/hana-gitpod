import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IApplication } from './application.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-application-detail',
  templateUrl: './application-detail.component.html',
})
export class ApplicationDetailComponent implements OnInit {
  application: IApplication | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ application }) => (this.application = application));
  }

  previousState(): void {
    window.history.back();
  }
}
