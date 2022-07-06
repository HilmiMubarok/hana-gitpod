import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmployment } from './employment.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-employment-detail',
  templateUrl: './employment-detail.component.html',
})
export class EmploymentDetailComponent implements OnInit {
  employment: IEmployment | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employment }) => (this.employment = employment));
  }

  previousState(): void {
    window.history.back();
  }
}
