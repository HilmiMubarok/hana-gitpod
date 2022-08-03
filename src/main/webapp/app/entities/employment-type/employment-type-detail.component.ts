import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmploymentType } from './employment-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-employment-type-detail',
  templateUrl: './employment-type-detail.component.html',
})
export class EmploymentTypeDetailComponent implements OnInit {
  employmentType: IEmploymentType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employmentType }) => (this.employmentType = employmentType));
  }

  previousState(): void {
    window.history.back();
  }
}
