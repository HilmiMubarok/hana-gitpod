import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPartyCif } from '../party-cif/party-cif.model';
import { PartyCifService } from '../party-cif/party-cif.service';
import { IOrganizationManagement } from './organization-management.model';

@Component({
  selector: 'jhi-organization-management-business-group-dialog',
  templateUrl: './organization-management-business-group-dialog.component.html',
  styleUrls: ['./organization-management.style.scss'],
})
export class OrganizationManagementBusinessGroupDialogComponent {
  public selectedPartyCif: IPartyCif;
  public organizationManagement: IOrganizationManagement;
  public view: boolean;
  public cif: string;
  constructor(
    private partyCifService: PartyCifService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      organizationManagement: IOrganizationManagement;
      view: boolean;
    },
    private _dialog: MatDialogRef<OrganizationManagementBusinessGroupDialogComponent>
  ) {
    this.organizationManagement = this.data.organizationManagement;
    this.selectedPartyCif = undefined;
    this.view = this.data.view;
  }

  public save(): void {
    this.organizationManagement.organization = this.selectedPartyCif.customerOrganization;
    this._dialog.close(this.organizationManagement);
  }

  public findCif(): void {
    this.selectedPartyCif = undefined;
    this.partyCifService.findPartyGroupByCif(this.cif).subscribe(res => {
      this.selectedPartyCif = res.body;
    });
  }
}
