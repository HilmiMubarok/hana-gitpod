import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GeneralParameterService } from '../master-parameter/general-parameter/general-parameter.service';
import { PartyCifService } from '../party-cif/party-cif.service';
import { IOrganizationManagement } from './organization-management.model';
import lodash from 'lodash';
import { IPartyGroup } from '../party-group/party-group.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

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
  public customerType = 'individu';
  public partyGroup: IPartyGroup;
  public isDisabled = false;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      organizationManagement: IOrganizationManagement;
      managementType: string;
      typeScreen: string;
    },
    private router: Router,
    private _dialog: MatDialogRef<OrganizationManagementDialogComponent>,
    private partyCifService: PartyCifService,
    private generalParameterService: GeneralParameterService
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.organizationManagement = this.data.organizationManagement;
    this.managementType = this.data.managementType;
    this.typeSable = this.data.typeScreen;
  }
  ngOnInit(): void {
    this.remove();
    this.removepacth();
    this.setPep();
    this.setPosition();
    // this.closes();
    this.setRadioButton();
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

  public SetNullObject = null;

  public save(): void {
    if (this.customerType === 'individu') {
      if (this.organizationManagement.shareHolderOrg !== null) {
        this.organizationManagement.shareHolderOrg = this.SetNullObject;
        this._dialog.close(this.organizationManagement);
      }
    } else if (this.customerType === 'corporate') {
      if (this.organizationManagement.person !== null) {
        this.organizationManagement.person = this.SetNullObject;
        this._dialog.close(this.organizationManagement);
      }
    }
    this._dialog.close(this.organizationManagement);
  }
  public closes() {
    this.organizationManagement.attributes.position = '';
  }
  public closePep() {
    this.organizationManagement.attributes.pep = '';
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
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'POSITION',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.posManagement = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
      });
  }

  public onChange(event: string) {
    this.organizationManagement.attributes['customerType'] = event;
  }

  // public setRadioButton() {
  //   this.customerType = this.organizationManagement.attributes['customerType'];
  //   if (this.organizationManagement.person.partyTypeId === 'PERSON' && this.customerType) {
  //     this.isDisabled = true;
  //   }
  //   if (this.organizationManagement.shareHolderOrg.partyTypeId === 'PARTY_GROUP' || this.customerType) {
  //     this.isDisabled = true;
  //   }
  // }

  public setRadioButton() {
    this.isDisabled = true;
    if (this.organizationManagement.person !== null) {
      this.customerType = 'individu';
      const setRadioActive = document.getElementById('individu') as HTMLInputElement;
      setRadioActive.checked = true;
    } else {
      this.customerType = 'corporate';
      const setRadioActive = document.getElementById('corporate') as HTMLInputElement;
      setRadioActive.checked = true;
    }
  }

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20vw',
      data: {
        title: '',
        message: 'Are you sure to cancel?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
