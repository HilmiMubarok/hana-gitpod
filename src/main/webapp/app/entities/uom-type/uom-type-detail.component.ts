import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUomType } from './uom-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-uom-type-detail',
  templateUrl: './uom-type-detail.component.html',
})
export class UomTypeDetailComponent implements OnInit {
  uomType: IUomType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ uomType }) => (this.uomType = uomType));
  }

  previousState(): void {
    window.history.back();
  }
}
