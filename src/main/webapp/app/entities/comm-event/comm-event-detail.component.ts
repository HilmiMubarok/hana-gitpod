import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICommEvent } from './comm-event.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-comm-event-detail',
  templateUrl: './comm-event-detail.component.html',
})
export class CommEventDetailComponent implements OnInit {
  commEvent: ICommEvent | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commEvent }) => (this.commEvent = commEvent));
  }

  previousState(): void {
    window.history.back();
  }
}
