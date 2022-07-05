import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDocument, Document } from '../document.model';
import { DocumentService } from '../service/document.service';

@Component({
  selector: 'jhi-document-update',
  templateUrl: './document-update.component.html',
})
export class DocumentUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    documentId: [],
    documentTypeId: [],
    documentTypeDescription: [],
    values: [],
    comments: [],
    valuesContentType: [],
    description: [],
  });

  constructor(protected documentService: DocumentService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ document }) => {
      this.updateForm(document);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const document = this.createFromForm();
    if (document.id !== undefined) {
      this.subscribeToSaveResponse(this.documentService.update(document));
    } else {
      this.subscribeToSaveResponse(this.documentService.create(document));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocument>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(document: IDocument): void {
    this.editForm.patchValue({
      id: document.id,
      documentId: document.documentId,
      documentTypeId: document.documentTypeId,
      documentTypeDescription: document.documentTypeDescription,
      values: document.values,
      comments: document.comments,
      valuesContentType: document.valuesContentType,
      description: document.description,
    });
  }

  protected createFromForm(): IDocument {
    return {
      ...new Document(),
      id: this.editForm.get(['id'])!.value,
      documentId: this.editForm.get(['documentId'])!.value,
      documentTypeId: this.editForm.get(['documentTypeId'])!.value,
      documentTypeDescription: this.editForm.get(['documentTypeDescription'])!.value,
      values: this.editForm.get(['values'])!.value,
      comments: this.editForm.get(['comments'])!.value,
      valuesContentType: this.editForm.get(['valuesContentType'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
