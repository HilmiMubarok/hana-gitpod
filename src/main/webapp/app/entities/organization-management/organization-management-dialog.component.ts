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
import { TemplateService } from 'app/layouts/template/template.service';
import { MessageService } from 'primeng/api';

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
  public source = '';

  constructor(
    private templateService: TemplateService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      organizationManagement: IOrganizationManagement;
      managementType: string;
      typeScreen: string;
      source: string;
    },
    private router: Router,
    private _dialog: MatDialogRef<OrganizationManagementDialogComponent>,
    private partyCifService: PartyCifService,
    private generalParameterService: GeneralParameterService,
    protected messageService: MessageService
  ) {
    this.organizationManagement = this.data.organizationManagement;
    this.managementType = this.data.managementType;
    this.typeSable = this.data.typeScreen;
    this.source = this.data.source;
  }
  ngOnInit(): void {
    this.getRole();
    this.remove();
    this.removepacth();
    this.setPep();
    this.setPosition();
    // this.closes();
    this.setRadioButton();
  }

  // menu idd organization Management
  public getRole() {
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.checkRole(newPos.positionTypeId);
    });
  }

  public checkRole(param): void {
    if (param === 'RM') {
      this._dialog.disableClose = true;
      this._dialog.backdropClick().subscribe(_ => {
        this.openCancelDialog();
      });
    }
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
    // this.partyCifService.getPep().subscribe(res => {
    //   this.pepStatus = res.body;
    //   console.log('harusnya', this.pepStatus);
    // });

    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'PEP_STATUS',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.pepStatus = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
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
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }

  //   validasi
  public Onsave(): void {
    this.validate().then(() => this.save());
    // if (this.customerType === 'individu') {
    //     this.validate().then(() => this.save());
    // }
    // else {
    // }
  }

  // Validation Loan Facility
  private _validateProcess(toValidate: object) {
    let isAllTrue = true;
    for (const key in toValidate) {
      if (Object.prototype.hasOwnProperty.call(toValidate, key)) {
        if (toValidate[key] === false) {
          isAllTrue = false;
          break;
        }
      }
    }

    return isAllTrue;
  }

  private _showNotification(severity: string, message: string): void {
    const severityCaptitalized = severity.charAt(0).toUpperCase() + severity.slice(1);
    this.messageService.add({ severity, summary: severityCaptitalized, detail: message, life: 3000 });
  }

  public checkMustValidated() {
    const mustValidate = {
      dob: true,
      name: true,
      gender: true,
      npwp: true,
      nik: true,
    };
    if (this.customerType === 'individu') {
      if (!this.organizationManagement.person.firstName) {
        this._showNotification('error', 'Please Enter First Name');
        mustValidate.name = false;
      }

      if (!this.organizationManagement.person.dob) {
        this._showNotification('error', 'Please Enter Date Of Birth');
        mustValidate.dob = false;
      }

      if (!this.organizationManagement.person.gender) {
        this._showNotification('error', 'Please Selected Gender');
        mustValidate.gender = false;
      }

      if (!this.organizationManagement.person.personalIdNumber) {
        this._showNotification('error', 'Please Enter ID Number');
        mustValidate.nik = false;
      }
    } else {
      if (!this.organizationManagement.shareHolderOrg.groupName) {
        this._showNotification('error', 'Please Enter Complate Name');
        mustValidate.name = false;
      }

      if (!this.organizationManagement.shareHolderOrg.taxIdNumber) {
        this._showNotification('error', 'Please Enter NPWP');
        mustValidate.npwp = false;
      }
    }

    return this._validateProcess(mustValidate);
  }

  public validateManagementShareHolder(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.checkMustValidated() && resolve('Management Share Holder');
    });
  }

  public validate(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      this.validateManagementShareHolder().then(() => resolve(true));
    });
  }
}
