import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOrganizationFinancial, OrganizationFinancial } from '../organization-financial.model';
import { OrganizationFinancialService } from '../service/organization-financial.service';

@Component({
  selector: 'jhi-organization-financial-update',
  templateUrl: './organization-financial-update.component.html',
})
export class OrganizationFinancialUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    fromDate: [],
    thruDate: [],
    organizationId: [],
    organizationName: [],
  });

  constructor(
    protected organizationFinancialService: OrganizationFinancialService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationFinancial }) => {
      if (organizationFinancial.id === undefined) {
        const today = dayjs().startOf('day');
        organizationFinancial.fromDate = today;
        organizationFinancial.thruDate = today;
      }

      this.updateForm(organizationFinancial);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organizationFinancial = this.createFromForm();
    if (organizationFinancial.id !== undefined) {
      this.subscribeToSaveResponse(this.organizationFinancialService.update(organizationFinancial));
    } else {
      this.subscribeToSaveResponse(this.organizationFinancialService.create(organizationFinancial));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganizationFinancial>>): void {
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

  protected updateForm(organizationFinancial: IOrganizationFinancial): void {
    this.editForm.patchValue({
      id: organizationFinancial.id,
      fromDate: organizationFinancial.fromDate ? organizationFinancial.fromDate.format(DATE_TIME_FORMAT) : null,
      thruDate: organizationFinancial.thruDate ? organizationFinancial.thruDate.format(DATE_TIME_FORMAT) : null,
      organizationId: organizationFinancial.organizationId,
      organizationName: organizationFinancial.organizationName,
    });
  }

  protected createFromForm(): IOrganizationFinancial {
    return {
      ...new OrganizationFinancial(),
      id: this.editForm.get(['id'])!.value,
      fromDate: this.editForm.get(['fromDate'])!.value ? dayjs(this.editForm.get(['fromDate'])!.value, DATE_TIME_FORMAT) : undefined,
      thruDate: this.editForm.get(['thruDate'])!.value ? dayjs(this.editForm.get(['thruDate'])!.value, DATE_TIME_FORMAT) : undefined,
      organizationId: this.editForm.get(['organizationId'])!.value,
      organizationName: this.editForm.get(['organizationName'])!.value,
    };
  }
}
