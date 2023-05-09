import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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

@Component({
  selector: 'jhi-request-slik-debitur-grid',
  templateUrl: './request-slik-debitur-grid.component.html',
})
export class RequestSlikDebiturGridComponent extends AbstractEntityMaterialComponent<IOrganizationManagement> implements OnChanges {
  constructor(
    protected organizationManagementService: OrganizationManagementService,
    protected _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    public requestSlikService: RequestSlikService,
    private partySlikService: PartySlikService
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyCif'] && changes['managementType']) {
      this.loadDataBy(this.partyCif.customerNumber, this.managementType);
      this.defineDisplayedColumns(this.managementType);
    }
  }

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
            console.log('res debitur', res.body);
            res.body.forEach(element => {
              this.requestSlikService.getCbasRes(this.requestSlikId, element.person.id).subscribe(cbasRes => {
                // console.log('cbasRes cbas', cbasRes.body.data.content);
                cbasRes.body.data.content.length > 0 &&
                  cbasRes.body.data.content.forEach(el => {
                    this.requestSlikService.getCbasFilterBy(el.id).subscribe(resFilter => {
                      console.log('res filter debitur', resFilter.body.data.content);
                      // add object key dataExpand on element
                      Object.assign(element, {
                        dataExpand: this.mapCbasResult(el, resFilter.body.data.content),
                      });
                      // console.log('THEE DATA', element);
                    });
                  });
              });
            });
            this.requestSlik.status !== 'Draft'
              ? this.requestSlikService.filterData(res, this.checklists, 'management').then(data => {
                  // console.log('thee data', data);
                  this.initDataForMatTable(data, res.headers);
                })
              : this.initDataForMatTable(res, res.headers);
            // this.initDataForMatTable(res, res.headers);
          },
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
    }
  }

  private defineDisplayedColumns(param: string) {
    this.displayedColumns =
      this.requestSlik.status === 'Verify'
        ? ['no', 'bank', 'limit', 'os', 'facilityType', 'rate', 'period', 'collateralValue', 'tenor', 'lastKol', 'worseKol']
        : ['no', 'bank', 'limit', 'os', 'facilityType', 'rate', 'period', 'collateralValue', 'tenor', 'lastKol', 'worseKol', 'action'];
    this.displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  }

  protected mapCbasResult(dataCbas, dataFilter) {
    const finalDataFilter = [];

    dataFilter.forEach(el => {
      finalDataFilter.push(this.requestSlikService.mapSlikResult(el));
    });

    const result = this.finalDataFilter(dataCbas.partyId, dataCbas.requestReffId, finalDataFilter);

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
    this.nikNpwp = el.nikNpwp;
    this.selectedVerifyData.emit(el);
  }
}
