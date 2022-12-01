import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { OrganizationManagementDialogComponent } from 'app/entities/organization-management/organization-management-dialog.component';
import {
  IOrganizationManagement,
  OrganizationManagement,
  OrganizationManagementAttributeManagementData,
  OrganizationManagementAttributeShareholder,
} from 'app/entities/organization-management/organization-management.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OrganizationManagementService } from 'app/entities/organization-management/organization-management.service';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { DebtorDataSlikUploadComponent } from '../debitur/debtor-data-silk-upload/debtor-data-slik-upload.component';
import lodash from 'lodash';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
@Component({
  selector: 'jhi-debtor-data-organization-management-list',
  templateUrl: './debtor-data-organization-management-list.component.html',
  styleUrls: ['./management-data.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({
          height: '0px',
          minHeight: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DebtorDataOrganizationManagementListComponent
  extends AbstractEntityMaterialComponent<IOrganizationManagement>
  implements OnChanges
{
  @Input() public cif: string;
  @Input() public managementType: string;
  public expandedElement: IOrganizationManagement | null;
  public organizationManagementRes: IOrganizationManagement[];

  @Input()
  get organizationManagement() {
    return this.items;
  }
  set organizationManagement(param: IOrganizationManagement[]) {
    this.items = param;
    console.log("data", this.organizationManagement);
    console.log("dataRes", this.organizationManagementRes);
    console.log("items", this.items);
  }

  private _partyCif: IPartyCif;
  private _partyCifDM: string;
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
    console.log("items", this.items);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cif'] && changes['managementType']) {
      this.loadDataBy(this.cif, this.managementType);
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
          cifNumber: this.cif,
          organizationManagementType: this.managementType,
          page: this.page,
          size: this.itemsPerPage,
          sort: ['id,desc'],
        })
        .subscribe({
          next: (res: HttpResponse<IOrganizationManagement[]>) => (
            (this.organizationManagementRes = res.body),console.log("items", this.items),console.log("data", this.organizationManagement),console.log("dataRes", this.organizationManagementRes), this.initDataForMatTable(res, res.headers)
          ),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
        console.log("items", this.items)
    }
  }

  protected postLoadDataLazy(): void {
    this.loadDataBy(this.cif, this.managementType);
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
            this.loadDataBy(this.cif, this.managementType);
          });
        } else {
          // create
          this.organizationManagementService.create(res).subscribe(rs => {
            this.loadDataBy(this.cif, this.managementType);
          });
        }
      }
    });
  }
}
