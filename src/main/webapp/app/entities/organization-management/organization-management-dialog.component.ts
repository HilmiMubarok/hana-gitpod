import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PartyCifService } from '../party-cif/party-cif.service';
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
  public text: any;
  public field: boolean;
  public view: boolean;
  public viewes: boolean;
  public pepStatus: any;
  public posManagement: any;
  public typeSable: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      organizationManagement: IOrganizationManagement;
      managementType: string;
      typeScreen: string;
    },
    private router: Router,
    private _dialog: MatDialogRef<OrganizationManagementDialogComponent>,
    private partyCifService: PartyCifService
  ) {
    this.organizationManagement = this.data.organizationManagement;
    this.managementType = this.data.managementType;
    this.typeSable = this.data.typeScreen;
  }
  ngOnInit(): void {
    this.remove();
    this.removepacth();
    this.setPep();
    this.setPosition();
    console.log('ini typeSable', this.typeSable);
    console.log('return type sable', this.dataSource());
  }

  public dataSource() {
    if (this.typeSable === undefined) {
      if (this.organizationManagement.dataSource === 'h' || this.organizationManagement.dataSource === 'H') {
        return true;
      }
    } else if (this.typeSable === 'approval') {
      return true;
    }
    return false;
  }

  public buttonApproval() {
    if (this.typeSable === 'approval') {
      return true;
    }
    return false;
  }

  public save(): void {
    this._dialog.close(this.organizationManagement);
  }
  public remove() {
    this.pacth = this.router.url.split('/')[1];
    if (
      this.pacth === 'credit-proposal-status' ||
      this.pacth === 'la-approval-inquiry' ||
      this.pacth === 'la-approval' ||
      this.pacth === 'la-SME-CRC'
    ) {
      this.view = true;
    }
  }
  public removepacth() {
    this.pacthh = this.router.url.split('/')[1];
    if (this.pacthh === 'party-cif') {
      this.viewes = true;
    }
  }

  public setPep() {
    this.partyCifService.getPep().subscribe(res => {
      this.pepStatus = res.body;
    });
  }

  public setPosition() {
    this.partyCifService.getPositionManagement().subscribe(res => {
      this.posManagement = res.body;
    });
  }
}
