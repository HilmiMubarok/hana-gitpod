import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRelationType } from './relation-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-relation-type-detail',
  templateUrl: './relation-type-detail.component.html',
})
export class RelationTypeDetailComponent implements OnInit {
  relationType: IRelationType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ relationType }) => (this.relationType = relationType));
  }

  previousState(): void {
    window.history.back();
  }
}
