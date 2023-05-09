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
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'jhi-request-slik-other-grid',
  templateUrl: './request-slik-other-grid.component.html',
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
export class RequestSlikOtherGridComponent extends AbstractEntityMaterialComponent<IOrganizationManagement> implements OnChanges {
  @Output() checklistData = new EventEmitter<any>();
  @Input() requestSlik: IRequestSlik;
  @Input() result: any;
  @Input() checklists;
  @Input() public cif: string;
  @Input() public managementType: string;
  public organizationManagementRes: IOrganizationManagement[];
  public _loanStatus: string;
  public expandedElement;
  public dataPartySlik: IPartySlik[];
  public displayedColumns: string[];
  public displayedColumnsExpand: string[];
  private _partyCif: IPartyCif;
  public displayedColumnsDetail: string[] = ['no', 'name', 'nikNpwp', 'noIdentitas', 'alamat', 'jenisKelamin', 'action'];
  dataSourceExpand;
  requestSlikId: number;
  nikNpwp;

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

  @Output() selectedVerifyData = new EventEmitter<any>();
  selectRow(el) {
    // console.log('select row', el);
    this.nikNpwp = el.nikNpwp;

    // Emit selectedVerifyData to parent
    this.selectedVerifyData.emit(el);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyCif'] && changes['managementType']) {
      this.loadDataBy(this.partyCif.customerNumber, this.managementType);
      this.defineDisplayedColumns(this.managementType);
    }
  }

  private defineDisplayedColumns(param: string) {
    // this.displayedColumns = ['no', 'fullname', 'idCard', 'dob', 'address', 'action'];
    this.displayedColumns =
      this.requestSlik.status === 'Verify'
        ? ['no', 'fullname', 'idCard', 'dob', 'address']
        : ['no', 'fullname', 'idCard', 'dob', 'address', 'action'];
    this.displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  }

  public loadDataBy(cif: string = null, managementType: string = null): void {
    if (cif && managementType) {
      // this.dataSourceExpand = ELEMENT_DATA;
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
            res.body.forEach(element => {
              this.requestSlikService.getCbasRes(this.requestSlikId, element.person.id).subscribe(cbasRes => {
                // console.log('cbasRes cbas', cbasRes.body.data.content);
                cbasRes.body.data.content.length > 0 &&
                  cbasRes.body.data.content.forEach(el => {
                    this.requestSlikService.getCbasFilterBy(el.id).subscribe(resFilter => {
                      // console.log('res filter', resFilter.body.data.content);
                      // add object key dataExpand on element
                      Object.assign(element, {
                        dataExpand: this.mapCbasResult(el, resFilter.body.data.content),
                      });
                    });
                  });
              });
            });
            this.requestSlik.status !== 'Draft'
              ? this.requestSlikService.filterData(res, this.checklists, 'other').then(data => this.initDataForMatTable(data, res.headers))
              : this.initDataForMatTable(res, res.headers);
          },
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
    }
  }

  mapCbasResult(dataCbas, dataFilter) {
    // console.log('Map Cbas Result', {
    //   dataCbas,
    //   dataFilter,
    // });
    const finalDataFilter = [];

    dataFilter.forEach(el => {
      finalDataFilter.push(this.requestSlikService.mapSlikResult(el));
    });

    const result = this.finalDataFilter(dataCbas.partyId, dataCbas.requestReffId, finalDataFilter);

    // console.log('FINAL', result);

    return result;
  }

  finalDataFilter(partyId, reqReffId, data) {
    // console.log('dataPartySlik', { data, partyId });
    const result = [];
    // const result2 = [];

    // dataPartySlik.forEach(el => {
    //   el.forEach(element => {
    //     element.resultJson.sliks.forEach(element2 => {
    //       console.log('element2', element2);
    //     });
    //   });
    // });

    data.forEach(el => {
      el.forEach(element => {
        result.push(element);
        // add party id
        element.partyId = partyId;
        // element.partySlik = dataPartySlik

        // add request reff id
        element.requestReffId = reqReffId;
      });
    });

    return result;
  }

  partyId;
  findDetail(expandedEl) {
    if (expandedEl) {
      const id = expandedEl.person.id;
      this.partyId = id;
      // console.log(expandedEl);
    } else {
      // console.log('closed expand');
    }
  }

  protected containsObject(obj, list) {
    const res = _.find(list, function (val) {
      return _.isEqual(obj, val);
    });
    return _.isObject(res) ? true : false;
  }

  isDetailChecked(row) {
    return this.requestSlikService.isDetailChecked(row, this.checklists, 'other');
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

  // private setAttribute(param: IOrganizationManagement): void {
  //   param.attributes = new OrganizationManagementAttributeShareholder();
  // }

  public openDialog(param: IOrganizationManagement = null): void {
    let orgMgm: IOrganizationManagement;
    orgMgm = new OrganizationManagement();
    orgMgm.cifNumber = this.cif;
    orgMgm.organizationManagementTypeId = this.managementType;
    orgMgm.attributes = {};
    // this.setAttribute(orgMgm);
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
