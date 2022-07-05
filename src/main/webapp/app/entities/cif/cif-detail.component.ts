import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICif } from './cif.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-cif-detail',
  templateUrl: './cif-detail.component.html',
})
export class CifDetailComponent implements OnInit {
  cif: ICif | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cif }) => (this.cif = cif));
  }

  previousState(): void {
    window.history.back();
  }
}
