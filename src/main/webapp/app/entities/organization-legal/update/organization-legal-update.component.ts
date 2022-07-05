import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOrganizationLegal, OrganizationLegal } from '../organization-legal.model';
import { OrganizationLegalService } from '../service/organization-legal.service';

@Component({
  selector: 'jhi-organization-legal-update',
  templateUrl: './organization-legal-update.component.html',
})
export class OrganizationLegalUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    fromDate: [],
    thruDate: [],
    organizationId: [],
    organizationName: [],
  });

  constructor(
    protected organizationLegalService: OrganizationLegalService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationLegal }) => {
      if (organizationLegal.id === undefined) {
        const today = dayjs().startOf('day');
        organizationLegal.fromDate = today;
        organizationLegal.thruDate = today;
      }

      this.updateForm(organizationLegal);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organizationLegal = this.createFromForm();
    if (organizationLegal.id !== undefined) {
      this.subscribeToSaveResponse(this.organizationLegalService.update(organizationLegal));
    } else {
      this.subscribeToSaveResponse(this.organizationLegalService.create(organizationLegal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganizationLegal>>): void {
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

  protected updateForm(organizationLegal: IOrganizationLegal): void {
    this.editForm.patchValue({
      id: organizationLegal.id,
      fromDate: organizationLegal.fromDate ? organizationLegal.fromDate.format(DATE_TIME_FORMAT) : null,
      thruDate: organizationLegal.thruDate ? organizationLegal.thruDate.format(DATE_TIME_FORMAT) : null,
      organizationId: organizationLegal.organizationId,
      organizationName: organizationLegal.organizationName,
    });
  }

  protected createFromForm(): IOrganizationLegal {
    return {
      ...new OrganizationLegal(),
      id: this.editForm.get(['id'])!.value,
      fromDate: this.editForm.get(['fromDate'])!.value ? dayjs(this.editForm.get(['fromDate'])!.value, DATE_TIME_FORMAT) : undefined,
      thruDate: this.editForm.get(['thruDate'])!.value ? dayjs(this.editForm.get(['thruDate'])!.value, DATE_TIME_FORMAT) : undefined,
      organizationId: this.editForm.get(['organizationId'])!.value,
      organizationName: this.editForm.get(['organizationName'])!.value,
    };
  }
}
