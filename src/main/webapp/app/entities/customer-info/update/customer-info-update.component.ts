import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICustomerInfo, CustomerInfo } from '../customer-info.model';
import { CustomerInfoService } from '../service/customer-info.service';

@Component({
  selector: 'jhi-customer-info-update',
  templateUrl: './customer-info-update.component.html',
})
export class CustomerInfoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
  });

  constructor(protected customerInfoService: CustomerInfoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customerInfo }) => {
      this.updateForm(customerInfo);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customerInfo = this.createFromForm();
    if (customerInfo.id !== undefined) {
      this.subscribeToSaveResponse(this.customerInfoService.update(customerInfo));
    } else {
      this.subscribeToSaveResponse(this.customerInfoService.create(customerInfo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomerInfo>>): void {
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

  protected updateForm(customerInfo: ICustomerInfo): void {
    this.editForm.patchValue({
      id: customerInfo.id,
    });
  }

  protected createFromForm(): ICustomerInfo {
    return {
      ...new CustomerInfo(),
      id: this.editForm.get(['id'])!.value,
    };
  }
}
