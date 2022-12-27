import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { Document, DocumentMetaData, IDocument} from 'app/entities/document/document.model'; 
import moment from 'moment';
import { StorageService } from 'app/entities/storage/storage.service'; 
import { DebtorDataViewUploadComponent } from './debtor-data-silk-upload/debtor-data-view-upload-slik.component';
@Component({
  selector: 'jhi-debtor-data-slik-summary-debitur',
  templateUrl: './debtor-data-slik-summary-debitur.component.html',
  styleUrls: ['./debtor-data-slik-summary-debitur.scss'],
})
export class DeborDataSlikSummaryDebiturComponent extends AbstractEntityMaterialComponent<IPartySlik> implements OnInit {
  public loading: boolean;
  public dataPartySlik: IPartySlik[];
  public folders= []

  private _partyCif: IPartyCif;
  private _partyCifDM: string;
  private _partyId: string;
  private _managementType: string
  public bucket: string

  @Input()
  get managementType(){
    return this._managementType
  }

  set managementType(ob: string){
    this._managementType = ob
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
  get partySlik() {
    return this.dataPartySlik;
  }

  set partySlik(object: IPartySlik[]) {
    this.dataPartySlik = object;
  }

  @Input()
  get partyCifDM() {
    return this._partyCifDM;
  }

  set partyCifDM(item: string) {
    this._partyCifDM = item;
  }

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
    'rate',
    'period',
    'collateralType',
    'collateralValue',
    'tenor',
    'lastKol',
    'worseKol',
    'restructureWay',
    'action',
  ];
  constructor(
    public partySlikService: PartySlikService,
    protected _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public TransferService: DebtorDataSlikTransferService,
    private storageService: StorageService
  ) {
    super(_snackBar, partySlikService);
    this.loading = false;
    this.itemsPerPage = 10;
    this.page = 0;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.dataPartySlik = [];
  }

  ngOnInit(): void {
    // this.loadDataBy();
    this.getFiles()

    this.getBucket()
  
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  public loadDataBy(): void {
    this.partySlikService
      .queryFilterBy({
        idParty: this.partyCif.partyId,
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id,desc'],
      })
      .subscribe({
        next: (res: HttpResponse<IPartyCif[]>) => {this.initDataForMatTable(res, res.headers)},
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

 

  private getFiles(): void {
    this.folders = []
      const predicate: Object = {
        key: `/party-cif/${this.partyCif.id}/document`,
      };
      this.storageService.getBucketName().subscribe((response: any) => {
   
        this.storageService.getObjects(response.body.bucket, predicate).subscribe((res:any) => {
      
       for (let i = 0; i < res.body.length; i++) {
            if (res.body[i].tags.managementType === this.managementType) {
              this.folders.push(res.body[i])
            }
        
       }
        
        });
      });
      
    
  }

  public viewDialog(){
      const predicate: object = {
        width: '80vw',
        data: this.folders,
      };
      this.getFiles()
      const dialogRef = this.dialog.open(DebtorDataViewUploadComponent, predicate);
      dialogRef.afterClosed().subscribe();
    
  }


  private doUpload(frmData: FormData, metaData: object): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe((response :any)=> { 
     
      this.storageService.uploadMeta(String(response.body.bucket), frmData, metaData).subscribe({
        next: res => resolve(),
        error: err => reject(),
      });
    })
    });
  }
  

  public uploadData(file:File[]) {

    const promises: Array<any> = new Array<any>();
    for (let i = 0; i < file.length; i++) {
      const metaData = {
        folder: '',
        objectName: '',
        entityId: 0,
        managementType: ''
      };
      const files = file[i].name.replace('&', '');
      const currentDate = moment().format('YYYYMMDDHHMMSSMS');
      metaData.folder = files;
      metaData.objectName = `/party-cif/${this.partyCif.id}/document/-${currentDate}-${files}`;
      metaData.entityId = this.partyCif.id;
      metaData.managementType =  this.managementType;
      const formData = new FormData();
      formData.append('file', file[i]);
    
      promises.push(this.doUpload(formData, metaData));
    }
  }

  public openDialog(element: IPartySlik = null, index: number): void {
    const predicate = {
      width: '80vw',
      data: {
        object: element,
        mode: this.mode,
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
        this.dataPartySlik[index] = res;
        this.partyCif.sliks = this.dataPartySlik;
        this.loading = false;
      }
    });
    // }
  }

  private mapperIPDFSlikToPartySlik(item: IPDFSlik): IPartySlik {
    const partySlik: IPartySlik = new PartySlik();
    partySlik.attributes = {
      name: item.debtorName,
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
    partySlik.facilityType = 0;

    const findPeriod = this.bulan.find(obj => obj.name === item.period.substring(3, 6));
    partySlik.period = findPeriod.id;

    return partySlik;
  }
  public resData: IPDFSlik[]
  public openDialogUpload(): void {
    const predicate: object = {
      width: '80vw',
      data: {
        partyId: this._partyId,
        cif: this.partyCif !== undefined ? this.partyCif.customerNumber : this.partyCifDM,
      
      },
    };
   
    const dialogRef = this.dialog.open(DebtorDataSlikUploadComponent, predicate);
    dialogRef.afterClosed().subscribe((response: any) => {
      this.resData = response.data
      if (this.dataPartySlik.length > 0 && this.dataPartySlik.length <= 1) {
        if (this.dataPartySlik[0].id === undefined) {
          this.dataPartySlik = [];
        }
      }

      if (this.resData) {
        this.uploadData(response.files)
        this.getFiles()
        for (let y = 0; y < this.resData.length; y++) {
          const item = this.resData[y];
          const partySlik: IPartySlik = this.mapperIPDFSlikToPartySlik(item);
          this.savePartySlik(partySlik);
          this.dataPartySlik = lodash.concat(this.dataPartySlik, partySlik);
          this.partyCif.sliks = this.dataPartySlik;
        }

        if (this.partyCif) {
          this.partyCif.sliks = this.dataPartySlik;
        }

        this.partySlik = this.dataPartySlik;
        this.TransferService.setparam(this.partySlik);
      }
    });
  }

  public async removeDebtorData(element: IPartySlik): Promise<void> {
    _.remove(this.dataPartySlik, function (n) {
      return n === element;
    });

    this.dataPartySlik = _.concat([], this.dataPartySlik);

    if (this.partyCif) {
      this.partyCif.sliks = this.dataPartySlik;
    }

    this.partySlik = this.dataPartySlik;
    this.TransferService.removeValue(element);
    await firstValueFrom(this.partySlikService.delete(element.id));
  }

  public savePartySlik(res: IPartySlik) {
    if (res.id) {
      this.partySlikService.update(res).subscribe((response: any) => {});
    } else {
      this.partySlikService.create(res).subscribe((response: any) => {});
    }
  }
}
