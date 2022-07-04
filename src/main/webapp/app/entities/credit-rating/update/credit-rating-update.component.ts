import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICreditRating, CreditRating } from '../credit-rating.model';
import { CreditRatingService } from '../service/credit-rating.service';

@Component({
  selector: 'jhi-credit-rating-update',
  templateUrl: './credit-rating-update.component.html',
})
export class CreditRatingUpdateComponent implements OnInit {
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

  constructor(protected creditRatingService: CreditRatingService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditRating }) => {
      if (creditRating.id === undefined) {
        const today = dayjs().startOf('day');
        creditRating.fromDate = today;
        creditRating.thruDate = today;
      }

      this.updateForm(creditRating);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const creditRating = this.createFromForm();
    if (creditRating.id !== undefined) {
      this.subscribeToSaveResponse(this.creditRatingService.update(creditRating));
    } else {
      this.subscribeToSaveResponse(this.creditRatingService.create(creditRating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICreditRating>>): void {
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

  protected updateForm(creditRating: ICreditRating): void {
    this.editForm.patchValue({
      id: creditRating.id,
      fromDate: creditRating.fromDate ? creditRating.fromDate.format(DATE_TIME_FORMAT) : null,
      thruDate: creditRating.thruDate ? creditRating.thruDate.format(DATE_TIME_FORMAT) : null,
      collateralTypeId: creditRating.collateralTypeId,
      collateralTypeDescription: creditRating.collateralTypeDescription,
      partyId: creditRating.partyId,
      partyName: creditRating.partyName,
      applicationId: creditRating.applicationId,
    });
  }

  protected createFromForm(): ICreditRating {
    return {
      ...new CreditRating(),
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
