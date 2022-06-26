import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITermType } from './term-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-term-type-detail',
  templateUrl: './term-type-detail.component.html',
})
export class TermTypeDetailComponent implements OnInit {
  termType: ITermType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ termType }) => (this.termType = termType));
  }

  previousState(): void {
    window.history.back();
  }
}
