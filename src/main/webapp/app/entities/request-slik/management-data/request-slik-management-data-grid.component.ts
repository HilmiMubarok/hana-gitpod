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
import { RequestSlikManagementDataDialogComponent } from './dialog/request-slik-management-data-dialog.component';
import { RequestSlikChecklistService } from '../services/request-slik-checklist.service';
import { RequestSlikDialogSlikFileComponent } from '../dialogs/request-slik-dialog-slik-file.component';
// import { RESULT_DATA } from './result.dummy';
@Component({
  selector: 'jhi-request-slik-management-data-grid',
  templateUrl: './request-slik-management-data-grid.component.html',
  styleUrls: ['./request-slik-management-data-grid.styles.scss'],
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
  constructor(
    protected organizationManagementService: OrganizationManagementService,
    protected _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    public requestSlikService: RequestSlikService,
    public requestSlikChecklistService: RequestSlikChecklistService
  ) {
    super(_snackBar, organizationManagementService);
    this.itemsPerPage = 99;
    this.page = 0;
    this.displayedColumns = null;
    this.displayedColumnsExpand = null;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.organizationManagementRes = [];
    this.requestSlikId = Number(this.router.url.split('/')[2]);
  }

  @Input() checklists;
  @Input() cif: string;
  @Input() managementType: string;
  @Input() requestSlik: IRequestSlik;
  @Input() result: any;
  @Output() checklistData = new EventEmitter<any>();

  public organizationManagementRes: IOrganizationManagement[];
  public _loanStatus: string;
  private _partyCif: IPartyCif;
  public dataPartySlik: IPartySlik[];
  public displayedColumns: string[];
  public displayedColumnsExpand;
  public requestSlikId: number;
  public expandedElement;
  public displayedColumnsDetail: string[] = ['no', 'name', 'nikNpwp', 'noIdentitas', 'alamat', 'jenisKelamin', 'action'];
  public dataSourceExpand;
  public nikNpwp;
  public partyId;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyCif'] && changes['managementType']) {
      this.loadDataBy(this.partyCif.customerNumber, this.managementType);
      this.defineDisplayedColumns(this.managementType);
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

        // add request reff id
        element.requestReffId = reqReffId;
        // element.partySlik = dataPartySlik
      });
    });

    return result;
  }

  // When user click the expand on the table
  findDetail(expandedEl) {
    if (expandedEl) {
      const id = expandedEl.person.id;
      this.partyId = id;

      // this.requestSlikService.getCbasResult(this.requestSlikId, id).subscribe(resss => {
      // const data = this.requestSlikService.parseSlikResult(resss);
      // console.log('ressssss', data);
      // });
    }
  }

  private defineDisplayedColumns(param: string) {
    // if status === 'Verify' then remove column select

    this.displayedColumns =
      this.requestSlik.status === 'VERIFY'
        ? ['no', 'fullname', 'position', 'idCard', 'dob', 'address', 'npwp', 'pep']
        : ['no', 'fullname', 'position', 'idCard', 'dob', 'address', 'npwp', 'pep', 'select'];
    // this.displayedColumns = ['no', 'fullname', 'position', 'idCard', 'dob', 'address', 'pep', 'select'];
    this.displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  }

  @Output() selectedVerifyData = new EventEmitter<any>();
  selectRow(el) {
    // console.log('select row', el);
    this.nikNpwp = el.nikNpwp;

    // Emit selectedVerifyData to parent
    this.selectedVerifyData.emit(el);
  }

  @Output() ocrDatas = new EventEmitter<any>();

  openDialogSlikFile(reqReffId, fileName) {
    console.log('asd', { reqReffId, fileName });
    const predicate: object = {
      width: '90vw',
      data: {
        reqReffId,
        fileName,
      },
    };

    const dialogRef = this.dialog.open(RequestSlikDialogSlikFileComponent, predicate);
    dialogRef.afterClosed().subscribe(() => {});
  }

  @Output() defaultChecklist = new EventEmitter<any>();
  public loadDataBy(cif: string = null, managementType: string = null): void {
    if (cif && managementType) {
      // this.dataSourceExpand = ELEMENT_DATA;
      // console.log('res test', this.requestSlikService.parseSlikResult(RESULT_DATA.data.content));
      // this.dataSourceExpand = this.requestSlikService.parseSlikResult(RESULT_DATA.data.content);
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
            console.log('res management data', {
              res: res.body,
              checklists: this.checklists,
            });
            // console.log(this.result);

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
                      // console.log('THEE DATA', element);
                    });
                  });
              });
            });
            // this.requestSlik.status !== 'DRAFT' && this.requestSlik.status !== 'RETURN_TO_RM'
            //   ? this.requestSlikService.filterData(res, this.checklists, 'management').then(data => {
            //       console.log('thee data', data);
            //       this.initDataForMatTable(data, res.headers);
            //     })
            //   : this.initDataForMatTable(res, res.headers);
            if (this.requestSlik.status !== 'DRAFT' && this.requestSlik.status !== 'RETURN_TO_RM') {
              this.requestSlikService.filterData(res, this.checklists, 'management').then(data => {
                console.log('thee data manaaa', data);
                this.ocrDatas.emit(data);
                this.initDataForMatTable(data, res.headers);
              });
            } else {
              console.log('sadkjhgsdjkasjdh', res);

              let checklistsDefault = [];
              res.body.forEach(checklist => {
                checklistsDefault = [
                  ...checklistsDefault,
                  {
                    idParty: checklist.person ? checklist.person.id : checklist.shareHolderOrg.id,
                    idRequestSlik: this.requestSlikId,
                  },
                ];
                this.defaultChecklist.emit(checklistsDefault);
              });

              /**
               * Get all Checklists -> Bandingkan dengan res, kalau yg ga ada di db jangan emit
               * kalau db kosong emit semua
               * */

              // this.requestSlikChecklistService.getAllChecklists().subscribe(sd => console.log('aaaaa', sd['data']));

              // res.body.forEach(element => {
              //   const data = {
              //     idParty: null,
              //     idRequestSlik: null,
              //   };
              //   data.idParty = element.person.id;
              //   data.idRequestSlik = this.requestSlikId;

              //   this.checklistData.emit({
              //     data,
              //     mode: 'add',
              //   });
              // });
              this.initDataForMatTable(res, res.headers);
            }
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
    console.log('SASDASD', ev);
    const data = {
      idParty: null,
      idRequestSlik: null,
      cust: null,
    };

    // Add additional data for ocrData
    data.cust = ev.person === null ? ev.shareHolderOrg : ev.person;

    data.idParty = ev.person.id;
    data.idRequestSlik = this.requestSlikId;
    if (check.checked) {
      // ketika cek
      this.requestSlikChecklistService.updateChecklistOcrs(data);
      this.checklistData.emit({
        data,
        mode: 'add',
      });
    } else {
      // ketika uncek

      // get checklist data by requestSlikId
      this.requestSlikService.getChecklistData(true, this.requestSlikId).subscribe(checklistData => {
        // get data where partyId === data.idParty
        const resChecklistData = checklistData.body.data.filter(res => res.idParty === data.idParty);

        resChecklistData.forEach(checklist => {
          // remove checklist
          this.requestSlikService.removeChecklist(checklist.id).subscribe();
        });
      });

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
  //   param.attributes = new OrganizationManagementAttributeManagementData();
  // }

  // public openDialog(param) {
  //   const dialogRef = this.dialog.open(RequestSlikManagementDataDialogComponent, {
  //     width: '90vw',
  //     data: {
  //       data: param,
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((res: IOrganizationManagement) => {
  //     console.log(res);
  //   });
  // }
  // public openDialog(param: IOrganizationManagement = null): void {
  //   let orgMgm: IOrganizationManagement;
  //   orgMgm = new OrganizationManagement();
  //   orgMgm.cifNumber = this.cif;
  //   orgMgm.organizationManagementTypeId = this.managementType;
  //   orgMgm.attributes = {};
  //   this.setAttribute(orgMgm);
  //   if (param) {
  //     orgMgm = param;
  //   }
  //   const dialogRef = this.dialog.open(OrganizationManagementDialogComponent, {
  //     width: '80vw',
  //     data: {
  //       organizationManagement: orgMgm,
  //       managementType: this.managementType,
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((res: IOrganizationManagement) => {
  //     if (res) {
  //       if (res.id) {
  //         // update
  //         this.organizationManagementService.update(res).subscribe(rs => {
  //           this.loadDataBy(this.partyCif.customerNumber, this.managementType);
  //         });
  //       } else {
  //         // create
  //         this.organizationManagementService.create(res).subscribe(rs => {
  //           this.loadDataBy(this.partyCif.customerNumber, this.managementType);
  //         });
  //       }
  //     }
  //   });
  // }
}
