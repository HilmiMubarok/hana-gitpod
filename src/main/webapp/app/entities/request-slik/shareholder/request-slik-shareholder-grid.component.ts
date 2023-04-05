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
import { IRequestSlik } from '../request-slik.model';
import { RequestSlikService } from '../request-slik.service';

@Component({
  selector: 'jhi-request-slik-shareholder-grid',
  templateUrl: './request-slik-shareholder-grid.component.html',
})
export class RequestSlikShareholderGridComponent extends AbstractEntityMaterialComponent<IOrganizationManagement> implements OnChanges {
  @Output() checklistData = new EventEmitter<any>();

  @Input() requestSlik: IRequestSlik;
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
    private router: Router,
    public requestSlikService: RequestSlikService
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
    this.displayedColumns = ['no', 'fullname', 'idCard', 'dob', 'ownership', 'address', 'pep', 'select'];
  }

  public loadDataBy(cif: string = null, managementType: string = null): void {
    if (cif && managementType) {
      this.organizationManagementService
        .queryFilterBy({
          cifNumber: this.cif,
          organizationManagementType: this.managementType,
          page: this.page,
          size: this.itemsPerPage,
          sort: ['id,desc'],
        })
        .subscribe({
          next: (res: HttpResponse<IOrganizationManagement[]>) => {
            this.requestSlik.status !== 'Draft'
              ? this.requestSlikService
                  .filterData(res, this.checklists, 'shareholder')
                  .then(data => this.initDataForMatTable(data, res.headers))
              : this.initDataForMatTable(res, res.headers);
          },
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

  @Input() checklists;
  isDetailChecked(row) {
    return this.requestSlikService.isDetailChecked(row, this.checklists, 'shareholder');
  }

  updateChecklist(ev, check) {
    const data = {
      idParty: null,
      idRequestSlik: null,
    };
    data.idParty = ev.person !== null ? ev.person.id : ev.shareHolderOrg.id;
    data.idRequestSlik = this.requestSlikId;
    if (check.checked) {
      // ketika cek

      this.checklistData.emit({
        data,
        mode: 'add',
      });
    } else {
      // ketika uncek
      this.checklistData.emit({
        data,
        mode: 'remove',
      });
    }
  }

  protected postLoadDataLazy(): void {
    this.loadDataBy(this.partyCif.customerNumber, this.managementType);
  }

  private setAttribute(param: IOrganizationManagement): void {
    param.attributes = new OrganizationManagementAttributeShareholder();
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

  // ======

  // _partyCif;
  // @Input()
  // get partyCif() {
  //   return this._partyCif;
  // }
  // set partyCif(items) {
  //   this._partyCif = items;
  // }

  // constructor(protected organizationManagementService: OrganizationManagementService, protected _snackBar: MatSnackBar) {
  //   super(_snackBar, organizationManagementService);
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('changes');
  // }

  // @Input() public cif: string;
  // @Input() public managementType: string;
  // public expandedElement: IOrganizationManagement | null;
  // public organizationManagementRes: IOrganizationManagement[];
  // public _loanStatus: string;
  // @Input()
  // get organizationManagement() {
  //   return this.items;
  // }
  // set organizationManagement(param: IOrganizationManagement[]) {
  //   this.items = param;
  // }

  // @Input()
  // get loanStatus() {
  //   return this._loanStatus;
  // }

  // set loanStatus(item: any) {
  //   this._loanStatus = item;
  // }

  // public displayedColumns: string[];
  // public columnsToDisplayWithExpand = [];
}

/**
 *
 *
 *
 @Input() public cif: string;
  @Input() public managementType: string;
  public expandedElement: IOrganizationManagement | null;
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
  public columnsToDisplayWithExpand = [];

  constructor(
    protected organizationManagementService: OrganizationManagementService,
    protected _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    super(_snackBar, organizationManagementService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.displayedColumns = null;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.organizationManagementRes = [];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyCif'] && changes['managementType']) {
      this.loadDataBy(this.partyCif.customerNumber, this.managementType);
      this.defineDisplayedColumns(this.managementType);
    }
  }

  private defineDisplayedColumns(param: string) {
    if (param === 'MANAGEMENT_DATA') {
      this.displayedColumns = ['no', 'fullname', 'position', 'idCard', 'dob', 'address'];
      this.columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
    } else if (param === 'SHAREHOLDER') {
      this.displayedColumns = ['no', 'fullname', 'idCard', 'dob', 'ownership', 'address'];
      this.columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
    } else if (param === 'CONTROL_PERSON') {
      this.displayedColumns = ['no', 'fullname', 'idCard', 'dob', 'address'];
      this.columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
    }
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

  protected postLoadDataLazy(): void {
    this.loadDataBy(this.partyCif.customerNumber, this.managementType);
  }

  private setAttribute(param: IOrganizationManagement): void {
    if (this.managementType === 'MANAGEMENT_DATA') {
      param.attributes = new OrganizationManagementAttributeManagementData();
    } else if (this.managementType === 'SHAREHOLDER') {
      param.attributes = new OrganizationManagementAttributeShareholder();
    }
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
 */
