import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOrganizationLegal } from './organization-legal.model';

@Component({
  selector: 'jhi-organization-legal-dialog',
  templateUrl: './organization-legal-dialog.component.html',
})
export class OrganizationLegalDialogComponent implements OnInit {
  public organizationLegal: IOrganizationLegal;
  public managementType: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      organizationLegal: IOrganizationLegal;
    },
    private _dialog: MatDialogRef<OrganizationLegalDialogComponent>
  ) {
    this.organizationLegal = this.data.organizationLegal;
  }
  ngOnInit(): void {
    console.log(this.organizationLegal);
  }
  public dataSource() {
    if (this.organizationLegal.dataSource === 'h' || this.organizationLegal.dataSource === 'H') {
      return true;
    }
    return false;
  }

  public save(): void {
    this._dialog.close(this.organizationLegal);
  }
}
