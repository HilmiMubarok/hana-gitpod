import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPartyCategoryType } from './party-category-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-party-category-type-detail',
  templateUrl: './party-category-type-detail.component.html',
})
export class PartyCategoryTypeDetailComponent implements OnInit {
  partyCategoryType: IPartyCategoryType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partyCategoryType }) => (this.partyCategoryType = partyCategoryType));
  }

  previousState(): void {
    window.history.back();
  }
}
