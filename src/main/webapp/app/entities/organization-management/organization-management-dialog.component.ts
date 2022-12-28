import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IOrganizationManagement } from './organization-management.model';

@Component({
  selector: 'jhi-organization-management-dialog',
  templateUrl: './organization-management-dialog.component.html',
  styleUrls: ['./organization-management.style.scss'],
})
export class OrganizationManagementDialogComponent implements OnInit {
  public organizationManagement: IOrganizationManagement;
  public managementType: string;
  public pacth: any;
  public pacthh: any;
  public view: boolean;
  public viewes: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      organizationManagement: IOrganizationManagement;
      managementType: string;
    },
    private router: Router,
    private _dialog: MatDialogRef<OrganizationManagementDialogComponent>
  ) {
    this.organizationManagement = this.data.organizationManagement;
    this.managementType = this.data.managementType;
  }
  ngOnInit(): void {
    this.remove();
    this.removepacth();
    console.log('organization management', this.organizationManagement);
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
  public remove() {
    this.pacth = this.router.url.split('/')[1];
    if (this.pacth === 'credit-proposal-status') {
      this.view = true;
    }
  }
  public removepacth() {
    this.pacthh = this.router.url.split('/')[1];
    if (this.pacthh === 'party-cif') {
      this.viewes = true;
    }
  }
}
