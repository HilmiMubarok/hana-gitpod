import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEmployment, Employment } from '../employment.model';
import { EmploymentService } from '../service/employment.service';

@Component({
  selector: 'jhi-employment-update',
  templateUrl: './employment-update.component.html',
})
export class EmploymentUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    fromDate: [],
    thruDate: [],
    relationTypeId: [],
    relationTypeDescription: [],
    partyToId: [],
    partyToName: [],
    partyFromId: [],
    partyFromName: [],
  });

  constructor(protected employmentService: EmploymentService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employment }) => {
      if (employment.id === undefined) {
        const today = dayjs().startOf('day');
        employment.fromDate = today;
        employment.thruDate = today;
      }

      this.updateForm(employment);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const employment = this.createFromForm();
    if (employment.id !== undefined) {
      this.subscribeToSaveResponse(this.employmentService.update(employment));
    } else {
      this.subscribeToSaveResponse(this.employmentService.create(employment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployment>>): void {
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

  protected updateForm(employment: IEmployment): void {
    this.editForm.patchValue({
      id: employment.id,
      fromDate: employment.fromDate ? employment.fromDate.format(DATE_TIME_FORMAT) : null,
      thruDate: employment.thruDate ? employment.thruDate.format(DATE_TIME_FORMAT) : null,
      relationTypeId: employment.relationTypeId,
      relationTypeDescription: employment.relationTypeDescription,
      partyToId: employment.partyToId,
      partyToName: employment.partyToName,
      partyFromId: employment.partyFromId,
      partyFromName: employment.partyFromName,
    });
  }

  protected createFromForm(): IEmployment {
    return {
      ...new Employment(),
      id: this.editForm.get(['id'])!.value,
      fromDate: this.editForm.get(['fromDate'])!.value ? dayjs(this.editForm.get(['fromDate'])!.value, DATE_TIME_FORMAT) : undefined,
      thruDate: this.editForm.get(['thruDate'])!.value ? dayjs(this.editForm.get(['thruDate'])!.value, DATE_TIME_FORMAT) : undefined,
      relationTypeId: this.editForm.get(['relationTypeId'])!.value,
      relationTypeDescription: this.editForm.get(['relationTypeDescription'])!.value,
      partyToId: this.editForm.get(['partyToId'])!.value,
      partyToName: this.editForm.get(['partyToName'])!.value,
      partyFromId: this.editForm.get(['partyFromId'])!.value,
      partyFromName: this.editForm.get(['partyFromName'])!.value,
    };
  }
}
