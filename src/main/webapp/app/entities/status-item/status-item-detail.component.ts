import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStatusItem } from './status-item.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-status-item-detail',
  templateUrl: './status-item-detail.component.html',
})
export class StatusItemDetailComponent implements OnInit {
  statusItem: IStatusItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ statusItem }) => (this.statusItem = statusItem));
  }

  previousState(): void {
    window.history.back();
  }
}
