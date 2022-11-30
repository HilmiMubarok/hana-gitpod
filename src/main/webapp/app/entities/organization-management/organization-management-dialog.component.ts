import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOrganizationManagement } from './organization-management.model';

@Component({
  selector: 'jhi-organization-management-dialog',
  templateUrl: './organization-management-dialog.component.html',
})
export class OrganizationManagementDialogComponent implements OnInit {
  public organizationManagement: IOrganizationManagement;
  public managementType: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      organizationManagement: IOrganizationManagement;
      managementType: string;
    },
    private _dialog: MatDialogRef<OrganizationManagementDialogComponent>
  ) {
    this.organizationManagement = this.data.organizationManagement;
    this.managementType = this.data.managementType;
  }
  ngOnInit(): void {
    console.log(this.organizationManagement);
  }
  public dataSource() {
    if (this.organizationManagement.dataSource === 'h' || this.organizationManagement.dataSource === 'H') {
      return true;
    }
    return false;
  }

  public save(): void {
    this._dialog.close(this.organizationManagement);
  }
}
