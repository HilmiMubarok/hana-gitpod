import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILendingProgramParameter } from './lending-program-parameter.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-lending-program-parameter-detail',
  templateUrl: './lending-program-parameter-detail.component.html',
})
export class LendingProgramParameterDetailComponent implements OnInit {
  lendingProgramParameter: ILendingProgramParameter | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lendingProgramParameter }) => (this.lendingProgramParameter = lendingProgramParameter));
  }

  previousState(): void {
    window.history.back();
  }
}
