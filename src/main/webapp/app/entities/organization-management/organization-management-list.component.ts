import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { OrganizationManagementDialogComponent } from './organization-management-dialog.component';
import {
  IOrganizationManagement,
  OrganizationManagement,
  OrganizationManagementAttributeManagementData,
  OrganizationManagementAttributeShareholder,
} from './organization-management.model';
import { OrganizationManagementService } from './organization-management.service';

@Component({
  selector: 'jhi-organization-management-list',
  templateUrl: './organization-management-list.component.html',
})
export class OrganizationManagementListComponent extends AbstractEntityMaterialComponent<IOrganizationManagement> implements OnChanges, OnInit {
  @Input() public cif: string;
  @Input() public managementType: string;

  @Input()
  get organizationManagement() {
    return this.items;
  }
  set organizationManagement(param: IOrganizationManagement[]) {
    this.items = param;
  }

  public displayedColumns: string[];
  public pacth: any;
  public view: boolean;
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
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cif'] && changes['managementType']) {
      this.loadDataBy(this.cif, this.managementType);
      this.defineDisplayedColumns(this.managementType);
    }
  }
   ngOnInit(): void {
    this.removefield();
  }

  private defineDisplayedColumns(param: string) {
    if (param === 'MANAGEMENT_DATA') {
      this.displayedColumns = ['no', 'fullname', 'position', 'idCard', 'dob', 'address', 'pep', 'action'];
    } else if (param === 'SHAREHOLDER') {
      this.displayedColumns = ['no', 'fullname', 'idCard', 'dob', 'ownership', 'address', 'pep', 'noOfShare', 'action'];
    } else if (param === 'CONTROL_PERSON') {
      this.displayedColumns = ['no', 'fullname', 'idCard', 'dob', 'address', 'action'];
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
          next: (res: HttpResponse<IOrganizationManagement[]>) => this.initDataForMatTable(res, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
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
public removefield() {
    this.pacth = this.router.url.split('/')[1];
    if (this.pacth === 'credit-proposal-status') {
      this.view = true;
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
