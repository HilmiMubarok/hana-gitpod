import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUomConversion } from './uom-conversion.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-uom-conversion-detail',
  templateUrl: './uom-conversion-detail.component.html',
})
export class UomConversionDetailComponent implements OnInit {
  uomConversion: IUomConversion | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ uomConversion }) => (this.uomConversion = uomConversion));
  }

  previousState(): void {
    window.history.back();
  }
}
