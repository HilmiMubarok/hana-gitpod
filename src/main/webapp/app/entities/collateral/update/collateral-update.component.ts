import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICollateral, Collateral } from '../collateral.model';
import { CollateralService } from '../service/collateral.service';

@Component({
  selector: 'jhi-collateral-update',
  templateUrl: './collateral-update.component.html',
})
export class CollateralUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    fromDate: [],
    thruDate: [],
    collateralTypeId: [],
    collateralTypeDescription: [],
    partyId: [],
    partyName: [],
    applicationId: [],
  });

  constructor(protected collateralService: CollateralService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ collateral }) => {
      if (collateral.id === undefined) {
        const today = dayjs().startOf('day');
        collateral.fromDate = today;
        collateral.thruDate = today;
      }

      this.updateForm(collateral);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const collateral = this.createFromForm();
    if (collateral.id !== undefined) {
      this.subscribeToSaveResponse(this.collateralService.update(collateral));
    } else {
      this.subscribeToSaveResponse(this.collateralService.create(collateral));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICollateral>>): void {
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

  protected updateForm(collateral: ICollateral): void {
    this.editForm.patchValue({
      id: collateral.id,
      fromDate: collateral.fromDate ? collateral.fromDate.format(DATE_TIME_FORMAT) : null,
      thruDate: collateral.thruDate ? collateral.thruDate.format(DATE_TIME_FORMAT) : null,
      collateralTypeId: collateral.collateralTypeId,
      collateralTypeDescription: collateral.collateralTypeDescription,
      partyId: collateral.partyId,
      partyName: collateral.partyName,
      applicationId: collateral.applicationId,
    });
  }

  protected createFromForm(): ICollateral {
    return {
      ...new Collateral(),
      id: this.editForm.get(['id'])!.value,
      fromDate: this.editForm.get(['fromDate'])!.value ? dayjs(this.editForm.get(['fromDate'])!.value, DATE_TIME_FORMAT) : undefined,
      thruDate: this.editForm.get(['thruDate'])!.value ? dayjs(this.editForm.get(['thruDate'])!.value, DATE_TIME_FORMAT) : undefined,
      collateralTypeId: this.editForm.get(['collateralTypeId'])!.value,
      collateralTypeDescription: this.editForm.get(['collateralTypeDescription'])!.value,
      partyId: this.editForm.get(['partyId'])!.value,
      partyName: this.editForm.get(['partyName'])!.value,
      applicationId: this.editForm.get(['applicationId'])!.value,
    };
  }
}
