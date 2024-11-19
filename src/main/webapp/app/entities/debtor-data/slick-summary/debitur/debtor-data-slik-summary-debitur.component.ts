import { Component, EventEmitter, Input, OnChanges, ViewChild, OnInit, Output, SimpleChanges } from '@angular/core';
import { IPartySlik, PartySlik } from 'app/entities/party-slik/party-slik.model';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import lodash, { result } from 'lodash';
import { DebtorDataSlikSummaryDebiturDialogComponent } from './debtor-data-slik-summary-debitur-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PartySlikService } from 'app/entities/party-slik/party-slik.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DebtorDataSlikUploadComponent } from './debtor-data-silk-upload/debtor-data-slik-upload.component';
import { DebtorDataSlikTransferService } from './debtor-data-silk-upload/debtor-data-slik-transfer.service';
import _ from 'lodash';
import { IPDFSlik } from 'app/shared/ocr/pdf-slik.model';
import { firstValueFrom } from 'rxjs';
import moment from 'moment';
import { StorageService } from 'app/entities/storage/storage.service';
import { DebtorDataViewUploadComponent } from './debtor-data-silk-upload/debtor-data-view-upload-slik.component';
import { Router } from '@angular/router';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-debtor-data-slik-summary-debitur',
  templateUrl: './debtor-data-slik-summary-debitur.component.html',
  styleUrls: ['./debtor-data-slik-summary-debitur.scss'],
  styles: [
    `
      mat-progress-spinner circle,
      .mat-spinner circle {
        stroke: white !important;
      }

      .mat-spinner::ng-deep circle {
        stroke: white !important;
      }
    `,
  ],
})
export class DeborDataSlikSummaryDebiturComponent extends AbstractEntityMaterialComponent<IPartySlik> implements OnInit, OnChanges {
  public loading: boolean;
  public folders = [];

  private _partyCif: IPartyCif;
  private _partyCifDM: string;
  private _partyId: string;
  private _managementType: string;
  public bucket: string;
  public parentPath = this.router.url.split('/')[1];
  public isCpApproval: boolean;

  @Input()
  get managementType() {
    return this._managementType;
  }

  set managementType(ob: string) {
    this._managementType = ob;
  }

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this._partyCif = object;
  }

  @Input()
  get partySliks() {
    return this.items;
  }

  set partySliks(object: IPartySlik[]) {
    this.items = object;
  }

  @Input()
  get partyCifDM() {
    return this._partyCifDM;
  }

  set partyCifDM(item: string) {
    this._partyCifDM = item;
  }

  @Input() loanStatus: string;

  @Input()
  get partyId() {
    return this._partyId;
  }

  set partyId(id: string) {
    this._partyId = id;
  }

  public bulan: any = [
    {
      id: 1,
      name: 'Jan',
    },
    {
      id: 2,
      name: 'Feb',
    },
    {
      id: 3,
      name: 'Mar',
    },
    {
      id: 4,
      name: 'Apr',
    },
    {
      id: 5,
      name: 'Mei',
    },
    {
      id: 6,
      name: 'Jun',
    },
    {
      id: 7,
      name: 'Jul',
    },
    {
      id: 8,
      name: 'Agu',
    },
    {
      id: 9,
      name: 'Sep',
    },
    {
      id: 10,
      name: 'Okt',
    },
    {
      id: 11,
      name: 'Nov',
    },
    {
      id: 12,
      name: 'Des',
    },
  ];

  public displayColumns: string[] = [
    'no',
    'bank',
    'limit',
    'os',
    'facilityType',
    'typeOfFacility',
    'rate',
    'period',
    'collateralValue',
    'tenor',
    'firstConstractDate',
    'disbursementDate',
    'maturityDate',
    'lastKol',
    'worseKol',
    'restructureMethod',
    'condition',
    'action',
  ];
  public detailSlik: any = [];
  public totalLimit = 0;
  public totalOutstanding = 0;
  public selectedManagementType = '';
  public selection = new SelectionModel<any>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.items.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.items.data.forEach(row => this.selection.select(row));
  }

  constructor(
    public partySlikService: PartySlikService,
    protected _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public TransferService: DebtorDataSlikTransferService,
    private storageService: StorageService,
    private router: Router,
    public creditProposalService: CreditProposalService,
    public messageService: MessageService
  ) {
    super(_snackBar, partySlikService, messageService);
    this.loading = false;
    this.itemsPerPage = 10;
    this.page = 0;
    this.predicate = 'id';
    this.entityKeyName = 'id';

    this.selection.changed.subscribe(() => {
      if (this.deleteAllProcess) {
        this.deleteState = `Deleting ${this.selection.selected.length} data`;
      } else {
        this.deleteState = `Delete ${this.selection.selected.length} data`;
      }
    });
  }
  public _loanStatus: string;
  ngOnChanges(changes: SimpleChanges): void {
    this._loanStatus = changes.loanStatus.currentValue;
    if (changes['partyId']) {
      this.loadDataBy();
    }
  }

  ngOnInit(): void {
    // hidden delete button debitur on cp approval
    /**
     * Detail:
     * BUKAN HANYA PADA STATE APPROVAL BM TAPI SEMUA STATE YANG ADA DISTAGE CP APPROVAL STATUS
     * CRECAS 1561
     */

    this.isCpApproval = this.parentPath === 'cp-status-approval' && true;

    this.getFiles();
    this.hideButtonUploadCP();
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  deleteAll() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Debtor Data',
        message: `Are you sure want to delete ${this.selection.selected.length} data?. This process cannot be undone`,
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.doDeleteAll(this.selection.selected)
          .then(() => {
            this.deleteState = `Delete ${this.selection.selected.length} Data`;
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete data, please try again',
            });
            this.deleteAllProcess = false;
            this.deleteState = `Delete ${this.selection.selected.length} Data`;
          });
      }
    });
  }

  public deleteState = '';
  public deleteAllProcess = false;

  public async doDeleteAll(elements: any): Promise<void> {
    this.deleteAllProcess = true;

    // Set deleteState to indicate the deletion process is running
    this.deleteState = `Deleting ${elements.length} data`;

    // Create an array to store the promises for removal operations
    const removalPromises: Promise<void>[] = [];

    // Loop through the array of elements and remove each one
    elements.forEach((element: IPartySlik) => {
      // Push the promise returned by remove operation to the array
      removalPromises.push(
        new Promise<void>((resolve, reject) => {
          _.remove(this.partySliks, n => n === element);
          this.TransferService.removeValue(element);

          // Convert Observable to Promise
          const deletePromise = this.partySlikService.delete(element.id).toPromise();

          deletePromise
            .then(() => {
              // Deselect the removed element
              this.selection.deselect(element);
              resolve();
            })
            .catch(error => {
              reject(error); // Propagate error to the outer Promise chain
            });
        })
      );
    });

    // Wait for all removal operations to complete
    await Promise.all(removalPromises);

    this.deleteAllProcess = false;

    this.loadDataBy();
  }

  dataSource = new MatTableDataSource<any>([]);
  public loadDataBy(): void {
    this.partySlikService
      .queryFilterBy({
        idParty: this.partyId,
        page: this.page,
        size: 9999,
        sort: ['id,desc'],
      })
      .subscribe({
        next: (res: HttpResponse<IPartyCif[]>) => {
          this.detailSlik = res.body;
          this.totalLimit = this.countTotalLimit(res.body);
          this.totalOutstanding = this.countTotalOutstanding(res.body);
          this.initDataForMatTable(res, res.headers);
          this.dataSource.data = res.body;
          this.dataSource.paginator = this.paginator;
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  protected postLoadDataLazy(): void {
    this.loadDataBy();
  }

  private getFiles(): void {
    this.folders = [];
    const predicate: Object = {
      key: `/party-cif/${this.partyId}/document`,
    };
    this.storageService.getBucketName().subscribe((response: any) => {
      this.storageService.getObjects(response.body.bucket, predicate).subscribe((res: any) => {
        for (let i = 0; i < res.body.length; i++) {
          if (res.body[i].tags.managementType === this.managementType) {
            this.folders.push(res.body[i]);
          }
        }
        if (this.folders[0] !== undefined) {
          if (this.folders[0].tags.managementType === this.managementType) {
            this.selectedManagementType = this.folders[0].tags.managementType;
          }
        }
      });
    });
  }

  public viewDialog() {
    const predicate: object = {
      width: '80vw',
      data: this.folders,
    };
    this.getFiles();
    const dialogRef = this.dialog.open(DebtorDataViewUploadComponent, predicate);
    dialogRef.afterClosed().subscribe();
  }

  private doUpload(frmData: FormData, metaData: object): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe((response: any) => {
        this.storageService.uploadMeta(String(response.body.bucket), frmData, metaData).subscribe({
          next: res => resolve(),
          error: err => reject(),
        });
      });
    });
  }

  public uploadData(file: File[]) {
    const promises: Array<any> = new Array<any>();
    for (let i = 0; i < file.length; i++) {
      const metaData = {
        folder: '',
        objectName: '',
        entityId: '',
        managementType: '',
      };
      const files = file[i].name.replace('&', '');
      const currentDate = moment().format('YYYYMMDDHHMMSSMS');
      metaData.folder = files;
      metaData.objectName = `/party-cif/${this.partyId}/document/-${currentDate}-${files}`;
      metaData.entityId = this.partyId;
      metaData.managementType = this.managementType;
      const formData = new FormData();
      formData.append('file', file[i]);

      promises.push(this.doUpload(formData, metaData));
    }
  }

  public openDialog(element: IPartySlik = null, index: number, view: string): void {
    const predicate = {
      width: '80vw',
      data: {
        selectedDataId: element.id,
        viewData: this.detailSlik,
        object: element,
        mode: view,
        cif: this.partyCif !== undefined ? this.partyCif.customerNumber : this.partyCifDM,
      },
    };
    if (element) {
      if (!lodash.has(element.attributes, 'name')) {
        element.attributes['name'] = '';
      }
      if (!lodash.has(element.attributes, 'relationship')) {
        element.attributes['relationship'] = '';
      }
      if (!lodash.has(element.attributes, 'facilityType')) {
        element.attributes['facilityType'] = '';
      }
      predicate.data['partySlik'] = element;
    }
    const dialogRef = this.dialog.open(DebtorDataSlikSummaryDebiturDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loading = true;
      }
      this.loading = false;
    });
  }

  // count total limit
  public countTotalLimit(partySlik: any): number {
    let totalLimit: number;
    totalLimit = 0;
    if (partySlik) {
      for (let i = 0; i < partySlik.length; i++) {
        totalLimit = totalLimit + Number(partySlik[i].limit);
      }
    }
    return totalLimit;
  }

  // count total outstanding
  public countTotalOutstanding(partySlik: any): number {
    let totalOutstanding: number;
    totalOutstanding = 0;
    if (partySlik) {
      for (let i = 0; i < partySlik.length; i++) {
        totalOutstanding = totalOutstanding + Number(partySlik[i].outstanding);
      }
    }
    return totalOutstanding;
  }

  private mapperIPDFSlikToPartySlik(item: IPDFSlik): IPartySlik {
    const partySlik: any = new PartySlik();
    partySlik.attributes = {
      name: item.debtorName,
      partySlikCollaterals: JSON.stringify(item.partySlikCollaterals),
    };
    partySlik.partyId = this.partyId;
    partySlik.bank = item.bank;
    partySlik.limit = item.limit === null ? 0 : Number(item.limit.toString().replace(/\./g, ''));
    partySlik.rate = item.rate == null ? 0 : Number(item.rate.toString().replace(' %', ''));
    partySlik.tenor = item.tenor == null ? 0 : Number(item.tenor.toString().replace(' bulan', ''));
    partySlik.outstanding = item.outstanding == null ? 0 : Number(item.outstanding.toString().replace(/\./g, ''));
    partySlik.collateralIdrMio = item.collateralIdrMio == null ? 0 : Number(item.collateralIdrMio.toString().replace(/\./g, ''));
    partySlik.restructureFrequency = item.frekuensiRestrukturasi == null ? 0 : Number(item.frekuensiRestrukturasi);
    partySlik.arrearsFrequency = item.frekuensiTunggakan == null ? 0 : Number(item.frekuensiTunggakan);
    partySlik.arrearsBase = item.tunggakanPokok == null ? 0 : Number(item.tunggakanPokok);
    partySlik.arrearsInterest = item.tunggakanBunga == null ? 0 : Number(item.tunggakanBunga);
    partySlik.arrearsReason = item.sebabMacet;
    partySlik.lastCollectability = item.kolTerakhir == null ? 0 : Number(item.kolTerakhir.substring(0, 1));
    partySlik.worstCollectability = item.kolTerburuk == null ? 0 : Number(item.kolTerburuk.substring(0, 1));
    partySlik.collateralType = item.collateralType == null ? '' : item.collateralType;
    partySlik.facilityType = item.facilityType;
    partySlik.period = item.period;
    partySlik.tanggalAkadAwal = item.tanggalAkadAwal;
    partySlik.tanggalMulai = item.tanggalMulai;
    partySlik.tanggalJatuhTempo = item.tanggalJatuhTempo;
    partySlik.typeOfFacility = item.typeOfFacility;
    partySlik.kondisi = item.kondisi;

    return partySlik;
  }
  public resData: IPDFSlik[];
  public openDialogUpload(): void {
    const predicate: object = {
      width: '80vw',
      data: {
        partyId: this.partyId,
        cif: this.partyCif !== undefined ? this.partyCif.customerNumber : this.partyCifDM,
      },
    };

    const dialogRef = this.dialog.open(DebtorDataSlikUploadComponent, predicate);
    dialogRef.afterClosed().subscribe((response: any) => {
      this.resData = response.data.kredit;

      if (this.resData) {
        this.uploadData(response.files);
        this.getFiles();

        const listPartySlik: IPartySlik[] = [];
        for (let y = 0; y < this.resData.length; y++) {
          const item = this.resData[y];
          const partySlik: IPartySlik = this.mapperIPDFSlikToPartySlik(item);
          listPartySlik.push(partySlik);
        }
        if (listPartySlik.length > 0) {
          this.creditProposalService.partySliks = listPartySlik;
          this.partySlikService.saveAll(listPartySlik).subscribe(res => {
            this.loadDataBy();
          });
        } else {
          this.loadDataBy();
        }
        this.TransferService.setparam(listPartySlik);
      }
    });
  }
  // Delete Confirmation
  public openRemoveDebtorData(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Debtor Data',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.removeDebtorData(element);
      }
    });
  }

  public async removeDebtorData(element: IPartySlik): Promise<void> {
    _.remove(this.partySliks, function (n) {
      return n === element;
    });

    this.TransferService.removeValue(element);
    await firstValueFrom(this.partySlikService.delete(element.id));
    this.loadDataBy();
  }

  public savePartySlik(res: IPartySlik): void {
    if (res.id) {
      this.partySlikService.update(res).subscribe(res2 => {});
    } else {
      this.partySlikService.create(res).subscribe(res2 => {});
    }
  }

  public isHideButtonCp: boolean;
  public hideButtonUploadCP() {
    if (this.parentPath === 'credit-proposal-status' || this.parentPath === 'cp-status-approval') {
      this.isHideButtonCp = true;
    }
  }

  public parseElements(element) {
    if (element === 0 || element === '') {
      return 'N/A';
    }
    return element;
  }

  public parseElementNumbers(element) {
    if (element !== null || element === 0) {
      const dataNumber = element.toFixed(Math.max(((element + '').split('.')[1] || '').length, 2));
      return dataNumber.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,');
    }
    return element;
  }
}
