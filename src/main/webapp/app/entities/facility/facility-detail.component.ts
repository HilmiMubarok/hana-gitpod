import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFacility } from './facility.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-facility-detail',
  templateUrl: './facility-detail.component.html',
})
export class FacilityDetailComponent implements OnInit {
  facility: IFacility | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ facility }) => (this.facility = facility));
  }

  previousState(): void {
    window.history.back();
  }
}
