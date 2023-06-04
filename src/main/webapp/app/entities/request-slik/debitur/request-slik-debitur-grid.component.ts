import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IOrganizationManagement } from 'app/entities/organization-management/organization-management.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { IRequestSlik } from '../request-slik.model';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { OrganizationManagementService } from 'app/entities/organization-management/organization-management.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RequestSlikService } from '../request-slik.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { PartySlikService } from 'app/entities/party-slik/party-slik.service';
import { RequestSlikDialogSlikFileComponent } from '../dialogs/request-slik-dialog-slik-file.component';
import { RequestSlikVerifyService } from '../services/request-slik-verify.service';

@Component({
  selector: 'jhi-request-slik-debitur-grid',
  templateUrl: './request-slik-debitur-grid.component.html',
  styleUrls: ['./request-slik-debitur-grid.styles.scss'],
})
export class RequestSlikDebiturGridComponent implements OnInit {
  dataaa;
  ngOnInit(): void {
    // const a = this.requestSlikService.mapSlikResult(this.sampleData);
    // this.dataaa = this.requestSlikService.mapSlikResult(this.sampleData);
    // this.dataaa = this.mapCbasResult(this.sampleData);
    // console.log('asdadasdasd', a);
    this.loadData();
  }
  constructor(
    protected organizationManagementService: OrganizationManagementService,
    protected _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    public requestSlikService: RequestSlikService,
    public requestSlikVerifyService: RequestSlikVerifyService
  ) {
    this.requestSlikId = Number(this.router.url.split('/')[2]);
    // this.loadData();
  }

  @Input() checklists;
  @Input() cif: string;
  @Input() managementType: string;
  @Input() requestSlik: IRequestSlik;
  @Input() result: any;
  @Output() checklistData = new EventEmitter<any>();
  @Output() selectedVerifyData = new EventEmitter<any>();

  public organizationManagementRes: IOrganizationManagement[];
  public _loanStatus: string;
  private _partyCif: IPartyCif;
  public dataPartySlik: IPartySlik[];
  public displayedColumns: string[];
  public displayedColumnsExpand;
  public requestSlikId: number;
  public expandedElement;
  public dataSourceExpand;
  public nikNpwp;
  public partyId;
  public displayedColumnsDetail: string[] = ['no', 'name', 'nikNpwp', 'noIdentitas', 'alamat', 'jenisKelamin', 'action'];
  public displayColumns: string[] = [
    'no',
    'bank',
    'limit',
    'os',
    'facilityType',
    'rate',
    'period',
    'collateralValue',
    'tenor',
    'lastKol',
    'worseKol',
    'action',
  ];

  openDialogSlikFile(reqReffId, fileName) {
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

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this.dataPartySlik = object.sliks;
    this._partyCif = object;
  }

  @Input()
  get loanStatus() {
    return this._loanStatus;
  }

  set loanStatus(item: any) {
    this._loanStatus = item;
  }

  dataSource = [];
  reqReffId;
  loadData() {
    console.log('THEE DATA DEBITUR partyId', this.partyCif.partyId);
    this.requestSlikService.getCbasRes(this.requestSlikId, this.partyCif.partyId).subscribe(cbasRes => {
      console.log('cbasRes cbas', cbasRes.body.data.content);
      this.reqReffId = cbasRes.body.data.content[0].reqReffId;
      cbasRes.body.data.content.length > 0 &&
        cbasRes.body.data.content.forEach(el => {
          this.requestSlikService.getCbasFilterBy(el.id).subscribe(resFilter => {
            console.log('Elemeeeeeen resFilter', resFilter);
            this.dataSource = this.mapCbasResult(el, resFilter.body.data.content);
            console.log('Elemeeeeeen dataSource', this.dataSource);
            this.requestSlikVerifyService.setOriginalVerifyData(this.dataSource);
            this.reqReffId = this.dataSource[0].requestReffId;
            console.log('Elemeeeeeen reqreffid', this.reqReffId);
            console.log('THEE DATA DEBITUR', this.dataSource);
          });
        });
    });
  }

  protected mapCbasResult(dataCbas, dataFilter) {
    const finalDataFilter = [];

    dataFilter.forEach(el => {
      finalDataFilter.push(this.requestSlikService.mapSlikResult(el));
    });

    const result = this.finalDataFilter(dataCbas.partyId, dataCbas.requestReffId, finalDataFilter);
    console.log('CBAS RESULT', result);

    return result;
  }

  protected finalDataFilter(partyId, reqReffId, data) {
    const result = [];

    data.forEach(el => {
      el.forEach(element => {
        result.push(element);
        // add party id
        element.partyId = partyId;
        // add request reff id
        element.requestReffId = reqReffId;
      });
    });

    return result;
  }

  // When user click the expand on the table
  protected findDetail(expandedEl) {
    if (expandedEl) {
      const id = expandedEl.person.id;
      this.partyId = id;
    }
  }

  protected selectRow(el) {
    console.log('Select row el', el);
    delete el.partySlik.partySlikCollaterals;
    this.nikNpwp = el.nikNpwp;
    this.selectedVerifyData.emit(el);
  }
}
