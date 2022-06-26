import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUom } from './uom.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-uom-detail',
  templateUrl: './uom-detail.component.html',
})
export class UomDetailComponent implements OnInit {
  uom: IUom | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ uom }) => (this.uom = uom));
  }

  previousState(): void {
    window.history.back();
  }
}
