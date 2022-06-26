import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFacilityType } from './facility-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-facility-type-detail',
  templateUrl: './facility-type-detail.component.html',
})
export class FacilityTypeDetailComponent implements OnInit {
  facilityType: IFacilityType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ facilityType }) => (this.facilityType = facilityType));
  }

  previousState(): void {
    window.history.back();
  }
}
