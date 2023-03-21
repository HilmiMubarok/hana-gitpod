import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationManagementDialogComponent } from 'app/entities/organization-management/organization-management-dialog.component';
import {
  IOrganizationManagement,
  OrganizationManagement,
  OrganizationManagementAttributeManagementData,
  OrganizationManagementAttributeShareholder,
} from 'app/entities/organization-management/organization-management.model';
import { OrganizationManagementService } from 'app/entities/organization-management/organization-management.service';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import * as _ from 'lodash';

@Component({
  selector: 'jhi-request-slik-management-data-grid',
  templateUrl: './request-slik-management-data-grid.component.html',
})
export class RequestSlikManagementDataGridComponent extends AbstractEntityMaterialComponent<IOrganizationManagement> implements OnChanges {
  @Output() checklistData = new EventEmitter<Array<Object>>();

  @Input() public cif: string;
  @Input() public managementType: string;
  public organizationManagementRes: IOrganizationManagement[];
  public _loanStatus: string;
  @Input()
  get organizationManagement() {
    return this.items;
  }
  set organizationManagement(param: IOrganizationManagement[]) {
    this.items = param;
  }

  private _partyCif: IPartyCif;
  public dataPartySlik: IPartySlik[];

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this.dataPartySlik = object.sliks;
    this._partyCif = object;
    this.loadDataBy();
  }

  @Input()
  get loanStatus() {
    return this._loanStatus;
  }

  set loanStatus(item: any) {
    this._loanStatus = item;
  }

  public displayedColumns: string[];

  requestSlikId: number;

  constructor(
    protected organizationManagementService: OrganizationManagementService,
    protected _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router
  ) {
    super(_snackBar, organizationManagementService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.displayedColumns = null;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.organizationManagementRes = [];
    this.requestSlikId = Number(this.router.url.split('/')[2]);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyCif'] && changes['managementType']) {
      this.loadDataBy(this.partyCif.customerNumber, this.managementType);
      this.defineDisplayedColumns(this.managementType);
    }
  }

  private defineDisplayedColumns(param: string) {
    this.displayedColumns = ['no', 'fullname', 'position', 'idCard', 'dob', 'address', 'select'];
  }

  public loadDataBy(cif: string = null, managementType: string = null): void {
    if (cif && managementType) {
      this.organizationManagementService
        .queryFilterBy({
          cifNumber: cif,
          organizationManagementType: managementType,
          page: this.page,
          size: this.itemsPerPage,
          sort: ['id,desc'],
        })
        .subscribe({
          next: (res: HttpResponse<IOrganizationManagement[]>) => (
            (this.organizationManagementRes = res.body), this.initDataForMatTable(res, res.headers)
          ),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
    }
  }

  protected containsObject(obj, list) {
    const res = _.find(list, function (val) {
      return _.isEqual(obj, val);
    });
    return _.isObject(res) ? true : false;
  }

  managementDataChecklist = [];
  updateChecklist(ev, check) {
    const data = {
      idParty: null,
      idRequestSlik: null,
    };
    if (check.checked) {
      // ketika cek
      data.idParty = ev.person.id;
      data.idRequestSlik = this.requestSlikId;

      if (!this.containsObject(data, this.managementDataChecklist)) {
        this.managementDataChecklist.push(data);
      }
    } else {
      // ketika uncek
      data.idParty = ev.person.id;
      data.idRequestSlik = this.requestSlikId;
      if (this.containsObject(data, this.managementDataChecklist)) {
        _.remove(this.managementDataChecklist, data);
      }
    }
    // console.log({ ev, cif: ev.person.id, check: check.checked, test: check.checked ? true : false, data: this.managementDataChecklist });
    this.checklistData.emit(this.managementDataChecklist);
  }

  protected postLoadDataLazy(): void {
    this.loadDataBy(this.partyCif.customerNumber, this.managementType);
  }

  private setAttribute(param: IOrganizationManagement): void {
    param.attributes = new OrganizationManagementAttributeManagementData();
  }

  public openDialog(param: IOrganizationManagement = null): void {
    let orgMgm: IOrganizationManagement;
    orgMgm = new OrganizationManagement();
    orgMgm.cifNumber = this.cif;
    orgMgm.organizationManagementTypeId = this.managementType;
    orgMgm.attributes = {};
    this.setAttribute(orgMgm);
    if (param) {
      orgMgm = param;
    }
    const dialogRef = this.dialog.open(OrganizationManagementDialogComponent, {
      width: '80vw',
      data: {
        organizationManagement: orgMgm,
        managementType: this.managementType,
      },
    });
    dialogRef.afterClosed().subscribe((res: IOrganizationManagement) => {
      if (res) {
        if (res.id) {
          // update
          this.organizationManagementService.update(res).subscribe(rs => {
            this.loadDataBy(this.partyCif.customerNumber, this.managementType);
          });
        } else {
          // create
          this.organizationManagementService.create(res).subscribe(rs => {
            this.loadDataBy(this.partyCif.customerNumber, this.managementType);
          });
        }
      }
    });
  }
}
