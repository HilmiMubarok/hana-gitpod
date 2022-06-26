import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorkType } from './work-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-work-type-detail',
  templateUrl: './work-type-detail.component.html',
})
export class WorkTypeDetailComponent implements OnInit {
  workType: IWorkType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ workType }) => (this.workType = workType));
  }

  previousState(): void {
    window.history.back();
  }
}
