import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReligionType } from './religion-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-religion-type-detail',
  templateUrl: './religion-type-detail.component.html',
})
export class ReligionTypeDetailComponent implements OnInit {
  religionType: IReligionType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ religionType }) => (this.religionType = religionType));
  }

  previousState(): void {
    window.history.back();
  }
}
