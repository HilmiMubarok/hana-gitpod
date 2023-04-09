import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { OrganizationManagementDialogComponent } from 'app/entities/organization-management/organization-management-dialog.component';
import {
  IOrganizationManagement,
  OrganizationManagement,
  OrganizationManagementAttributeManagementData,
} from 'app/entities/organization-management/organization-management.model';
import { OrganizationManagementService } from 'app/entities/organization-management/organization-management.service';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import * as _ from 'lodash';
import { IRequestSlik } from '../request-slik.model';
import { RequestSlikService } from '../request-slik.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'jhi-request-slik-management-data-grid',
  templateUrl: './request-slik-management-data-grid.component.html',
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
export class RequestSlikManagementDataGridComponent extends AbstractEntityMaterialComponent<IOrganizationManagement> implements OnChanges {
  @Output() checklistData = new EventEmitter<any>();
  @Input() checklists;
  @Input() cif: string;
  @Input() managementType: string;
  @Input() requestSlik: IRequestSlik;
  @Input() result: any;

  public organizationManagementRes: IOrganizationManagement[];
  public _loanStatus: string;
  private _partyCif: IPartyCif;
  public dataPartySlik: IPartySlik[];
  public displayedColumns: string[];
  public displayedColumnsExpand;
  public requestSlikId: number;
  public expandedElement;
  @Input()
  get organizationManagement() {
    return this.items;
  }
  set organizationManagement(param: IOrganizationManagement[]) {
    this.items = param;
  }

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

  isDetailChecked(row) {
    return this.requestSlikService.isDetailChecked(row, this.checklists, 'management');
  }

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
    this.displayedColumnsExpand = null;
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

  findDetail() {
    console.log('Detail');
  }

  private defineDisplayedColumns(param: string) {
    this.displayedColumns = ['no', 'fullname', 'position', 'idCard', 'dob', 'address', 'pep', 'select'];
    this.displayedColumnsExpand = [...this.displayedColumns, 'expand'];
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
            console.log(this.result);

            this.requestSlik.status !== 'Draft'
              ? this.requestSlikService
                  .filterData(res, this.checklists, 'management')
                  .then(data => this.initDataForMatTable(data, res.headers))
              : // this.initDataForMatTable(data, res.headers)
                this.initDataForMatTable(res, res.headers);
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

  updateChecklist(ev, check) {
    const data = {
      idParty: null,
      idRequestSlik: null,
    };
    data.idParty = ev.person.id;
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
