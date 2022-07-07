import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICommEventType } from './comm-event-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-comm-event-type-detail',
  templateUrl: './comm-event-type-detail.component.html',
})
export class CommEventTypeDetailComponent implements OnInit {
  commEventType: ICommEventType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ commEventType }) => (this.commEventType = commEventType));
  }

  previousState(): void {
    window.history.back();
  }
}
