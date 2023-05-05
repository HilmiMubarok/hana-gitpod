import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDocumentType } from './document-type.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-document-type-detail',
  templateUrl: './document-type-detail.component.html',
})
export class DocumentTypeDetailComponent implements OnInit {
  documentType: IDocumentType | null = null;

  constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documentType }) => (this.documentType = documentType));
  }

  previousState(): void {
    window.history.back();
  }
}
