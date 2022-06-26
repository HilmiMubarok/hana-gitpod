import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IContactMechType } from './contact-mech-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-contact-mech-type-detail',
  templateUrl: './contact-mech-type-detail.component.html',
})
export class ContactMechTypeDetailComponent implements OnInit {
  contactMechType: IContactMechType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contactMechType }) => (this.contactMechType = contactMechType));
  }

  previousState(): void {
    window.history.back();
  }
}
