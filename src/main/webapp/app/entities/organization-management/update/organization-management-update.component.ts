import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOrganizationManagement, OrganizationManagement } from '../organization-management.model';
import { OrganizationManagementService } from '../service/organization-management.service';

@Component({
  selector: 'jhi-organization-management-update',
  templateUrl: './organization-management-update.component.html',
})
export class OrganizationManagementUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    fromDate: [],
    thruDate: [],
    organizationId: [],
    organizationName: [],
  });

  constructor(
    protected organizationManagementService: OrganizationManagementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organizationManagement }) => {
      if (organizationManagement.id === undefined) {
        const today = dayjs().startOf('day');
        organizationManagement.fromDate = today;
        organizationManagement.thruDate = today;
      }

      this.updateForm(organizationManagement);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organizationManagement = this.createFromForm();
    if (organizationManagement.id !== undefined) {
      this.subscribeToSaveResponse(this.organizationManagementService.update(organizationManagement));
    } else {
      this.subscribeToSaveResponse(this.organizationManagementService.create(organizationManagement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganizationManagement>>): void {
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

  protected updateForm(organizationManagement: IOrganizationManagement): void {
    this.editForm.patchValue({
      id: organizationManagement.id,
      fromDate: organizationManagement.fromDate ? organizationManagement.fromDate.format(DATE_TIME_FORMAT) : null,
      thruDate: organizationManagement.thruDate ? organizationManagement.thruDate.format(DATE_TIME_FORMAT) : null,
      organizationId: organizationManagement.organizationId,
      organizationName: organizationManagement.organizationName,
    });
  }

  protected createFromForm(): IOrganizationManagement {
    return {
      ...new OrganizationManagement(),
      id: this.editForm.get(['id'])!.value,
      fromDate: this.editForm.get(['fromDate'])!.value ? dayjs(this.editForm.get(['fromDate'])!.value, DATE_TIME_FORMAT) : undefined,
      thruDate: this.editForm.get(['thruDate'])!.value ? dayjs(this.editForm.get(['thruDate'])!.value, DATE_TIME_FORMAT) : undefined,
      organizationId: this.editForm.get(['organizationId'])!.value,
      organizationName: this.editForm.get(['organizationName'])!.value,
    };
  }
}
