import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICif, Cif } from '../cif.model';
import { CifService } from '../service/cif.service';

@Component({
  selector: 'jhi-cif-update',
  templateUrl: './cif-update.component.html',
})
export class CifUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    number: [],
    partyId: [],
  });

  constructor(protected cifService: CifService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cif }) => {
      this.updateForm(cif);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cif = this.createFromForm();
    if (cif.id !== undefined) {
      this.subscribeToSaveResponse(this.cifService.update(cif));
    } else {
      this.subscribeToSaveResponse(this.cifService.create(cif));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICif>>): void {
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

  protected updateForm(cif: ICif): void {
    this.editForm.patchValue({
      id: cif.id,
      number: cif.number,
      partyId: cif.partyId,
    });
  }

  protected createFromForm(): ICif {
    return {
      ...new Cif(),
      id: this.editForm.get(['id'])!.value,
      number: this.editForm.get(['number'])!.value,
      partyId: this.editForm.get(['partyId'])!.value,
    };
  }
}
