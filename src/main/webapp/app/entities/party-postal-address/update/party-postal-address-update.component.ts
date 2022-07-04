import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPartyPostalAddress, PartyPostalAddress } from '../party-postal-address.model';
import { PartyPostalAddressService } from '../service/party-postal-address.service';

@Component({
  selector: 'jhi-party-postal-address-update',
  templateUrl: './party-postal-address-update.component.html',
})
export class PartyPostalAddressUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    fromDate: [],
    thruDate: [],
    partyId: [],
    partyName: [],
    addressId: [],
    addressDescription: [],
    purposeTypeId: [],
    purposeTypeDescription: [],
  });

  constructor(
    protected partyPostalAddressService: PartyPostalAddressService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partyPostalAddress }) => {
      if (partyPostalAddress.id === undefined) {
        const today = dayjs().startOf('day');
        partyPostalAddress.fromDate = today;
        partyPostalAddress.thruDate = today;
      }

      this.updateForm(partyPostalAddress);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const partyPostalAddress = this.createFromForm();
    if (partyPostalAddress.id !== undefined) {
      this.subscribeToSaveResponse(this.partyPostalAddressService.update(partyPostalAddress));
    } else {
      this.subscribeToSaveResponse(this.partyPostalAddressService.create(partyPostalAddress));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPartyPostalAddress>>): void {
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

  protected updateForm(partyPostalAddress: IPartyPostalAddress): void {
    this.editForm.patchValue({
      id: partyPostalAddress.id,
      fromDate: partyPostalAddress.fromDate ? partyPostalAddress.fromDate.format(DATE_TIME_FORMAT) : null,
      thruDate: partyPostalAddress.thruDate ? partyPostalAddress.thruDate.format(DATE_TIME_FORMAT) : null,
      partyId: partyPostalAddress.partyId,
      partyName: partyPostalAddress.partyName,
      addressId: partyPostalAddress.addressId,
      addressDescription: partyPostalAddress.addressDescription,
      purposeTypeId: partyPostalAddress.purposeTypeId,
      purposeTypeDescription: partyPostalAddress.purposeTypeDescription,
    });
  }

  protected createFromForm(): IPartyPostalAddress {
    return {
      ...new PartyPostalAddress(),
      id: this.editForm.get(['id'])!.value,
      fromDate: this.editForm.get(['fromDate'])!.value ? dayjs(this.editForm.get(['fromDate'])!.value, DATE_TIME_FORMAT) : undefined,
      thruDate: this.editForm.get(['thruDate'])!.value ? dayjs(this.editForm.get(['thruDate'])!.value, DATE_TIME_FORMAT) : undefined,
      partyId: this.editForm.get(['partyId'])!.value,
      partyName: this.editForm.get(['partyName'])!.value,
      addressId: this.editForm.get(['addressId'])!.value,
      addressDescription: this.editForm.get(['addressDescription'])!.value,
      purposeTypeId: this.editForm.get(['purposeTypeId'])!.value,
      purposeTypeDescription: this.editForm.get(['purposeTypeDescription'])!.value,
    };
  }
}
