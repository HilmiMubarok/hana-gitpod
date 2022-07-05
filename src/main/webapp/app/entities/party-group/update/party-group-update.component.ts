import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPartyGroup, PartyGroup } from '../party-group.model';
import { PartyGroupService } from '../service/party-group.service';

@Component({
  selector: 'jhi-party-group-update',
  templateUrl: './party-group-update.component.html',
})
export class PartyGroupUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    groupName: [],
    prefix: [],
    officePhone: [],
    otherPhone: [],
    officeMail: [],
    faxOffice: [],
    taxIdNumber: [],
  });

  constructor(protected partyGroupService: PartyGroupService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ partyGroup }) => {
      this.updateForm(partyGroup);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const partyGroup = this.createFromForm();
    if (partyGroup.id !== undefined) {
      this.subscribeToSaveResponse(this.partyGroupService.update(partyGroup));
    } else {
      this.subscribeToSaveResponse(this.partyGroupService.create(partyGroup));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPartyGroup>>): void {
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

  protected updateForm(partyGroup: IPartyGroup): void {
    this.editForm.patchValue({
      id: partyGroup.id,
      groupName: partyGroup.groupName,
      prefix: partyGroup.prefix,
      officePhone: partyGroup.officePhone,
      otherPhone: partyGroup.otherPhone,
      officeMail: partyGroup.officeMail,
      faxOffice: partyGroup.faxOffice,
      taxIdNumber: partyGroup.taxIdNumber,
    });
  }

  protected createFromForm(): IPartyGroup {
    return {
      ...new PartyGroup(),
      id: this.editForm.get(['id'])!.value,
      groupName: this.editForm.get(['groupName'])!.value,
      prefix: this.editForm.get(['prefix'])!.value,
      officePhone: this.editForm.get(['officePhone'])!.value,
      otherPhone: this.editForm.get(['otherPhone'])!.value,
      officeMail: this.editForm.get(['officeMail'])!.value,
      faxOffice: this.editForm.get(['faxOffice'])!.value,
      taxIdNumber: this.editForm.get(['taxIdNumber'])!.value,
    };
  }
}
