import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPartyCif } from './party-cif.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-party-cif-detail',
  templateUrl: './party-cif-detail.component.html',
})
export class PartyCifDetailComponent implements OnInit {
  partyCif: IPartyCif | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partyCif }) => (this.partyCif = partyCif));
  }

  previousState(): void {
    window.history.back();
  }
}
