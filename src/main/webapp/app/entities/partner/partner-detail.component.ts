import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPartner } from './partner.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-partner-detail',
  templateUrl: './partner-detail.component.html',
})
export class PartnerDetailComponent implements OnInit {
  partner: IPartner | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partner }) => (this.partner = partner));
  }

  previousState(): void {
    window.history.back();
  }
}
