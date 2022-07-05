import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICollateralType, CollateralType } from '../collateral-type.model';
import { CollateralTypeService } from '../service/collateral-type.service';

@Component({
  selector: 'jhi-collateral-type-update',
  templateUrl: './collateral-type-update.component.html',
})
export class CollateralTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    description: [],
    parentId: [],
    parentDescription: [],
  });

  constructor(
    protected collateralTypeService: CollateralTypeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ collateralType }) => {
      this.updateForm(collateralType);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const collateralType = this.createFromForm();
    if (collateralType.id !== undefined) {
      this.subscribeToSaveResponse(this.collateralTypeService.update(collateralType));
    } else {
      this.subscribeToSaveResponse(this.collateralTypeService.create(collateralType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICollateralType>>): void {
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

  protected updateForm(collateralType: ICollateralType): void {
    this.editForm.patchValue({
      id: collateralType.id,
      description: collateralType.description,
      parentId: collateralType.parentId,
      parentDescription: collateralType.parentDescription,
    });
  }

  protected createFromForm(): ICollateralType {
    return {
      ...new CollateralType(),
      id: this.editForm.get(['id'])!.value,
      description: this.editForm.get(['description'])!.value,
      parentId: this.editForm.get(['parentId'])!.value,
      parentDescription: this.editForm.get(['parentDescription'])!.value,
    };
  }
}
