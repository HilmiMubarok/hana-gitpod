import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPartyCif } from '../party-cif/party-cif.model';
import { PartyCifService } from '../party-cif/party-cif.service';
import { ICustomerGroup } from './customer-group.model';

@Component({
  selector: 'jhi-customer-group-dialog',
  templateUrl: './customer-group-dialog.component.html',
  styleUrls: ['./customer-group.style.scss'],
})
export class CustomerGroupDialogComponent {
  public customerGroup: ICustomerGroup;
  public selectedPartyCif: IPartyCif;
  public cif: string;
  public view: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      customerGroup: ICustomerGroup;
      view: boolean;
    },
    private partyCifService: PartyCifService,
    private _dialog: MatDialogRef<CustomerGroupDialogComponent>
  ) {
    this.view = this.data.view;
    this.customerGroup = this.data.customerGroup;
  }

  private getPartyId(): string {
    return this.selectedPartyCif.customerOrganization
      ? this.selectedPartyCif.customerOrganization.id
      : this.selectedPartyCif.customerPerson.id;
  }

  public save(): void {
    this.customerGroup.partyIdTo = this.getPartyId();
    this.customerGroup.cifTo = this.selectedPartyCif.customerNumber;
    this._dialog.close(this.customerGroup);
  }

  public findCif(): void {
    this.selectedPartyCif = undefined;
    this.partyCifService.findPartyGroupByCif(this.cif).subscribe(res => {
      this.selectedPartyCif = res.body;
    });
  }
}
