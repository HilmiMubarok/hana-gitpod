import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPartySlik, PartySlik } from 'app/entities/party-slik/party-slik.model';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import lodash from 'lodash';
import { DebtorDataSlikSummaryDebiturDialogComponent } from './debtor-data-slik-summary-debitur-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PartySlikService } from 'app/entities/party-slik/party-slik.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DebtorDataSlikUploadComponent } from './debtor-data-silk-upload/debtor-data-slik-upload.component';
import { DebtorDataSlikTransferService } from './debtor-data-silk-upload/debtor-data-slik-transfer.service';
import _ from 'lodash';
@Component({
  selector: 'jhi-debtor-data-slik-summary-debitur',
  templateUrl: './debtor-data-slik-summary-debitur.component.html',
  styleUrls: ['./debtor-data-slik-summary-debitur.scss'],
})
export class DeborDataSlikSummaryDebiturComponent extends AbstractEntityMaterialComponent<IPartySlik> {
  public loading: boolean;
  public dataPartySlik: IPartySlik[];

  private _partyCif: IPartyCif;
  private _partyCifDM: string;
  private _partyId: string;

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

  set partyId(id : string) {
    this._partyId = id;
  }

  public bulan: any = [
    {'id':1,'name':'Jan'},{'id':2,'name':'Feb'},{'id':3,'name':'Mar'},{'id':4,'name':'Apr'},{'id':5,'name':'Mei'},{'id':6,'name':'Jun'},
    {'id':7,'name':'Jul'},{'id':8,'name':'Agu'},{'id':9,'name':'Sep'},{'id':10,'name':'Okt'},{'id':11,'name':'Nov'},{'id':12,'name':'Des'}
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
    public TransferService : DebtorDataSlikTransferService
    ) {
    super(_snackBar, partySlikService);
    this.loading = false;
    this.itemsPerPage = 10;
    this.page = 0;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.dataPartySlik = [];
  }

  // ngOnInit(): void {
  //   this.loadDataBy();

  //   console.log("cif", this.partyCif);
  // }

  public loadDataBy(): void {
    this.partySlikService
      .queryFilterBy({
        idParty: this.partyCif.partyId,
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id,desc'],
      })
      .subscribe({
        next: (res: HttpResponse<IPartyCif[]>) => {console.log('ress',res),this.initDataForMatTable(res, res.headers)},
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  public openDialog(element: IPartySlik = null, index: number): void {
    // let object = {};
    const object = {};
    // for (let index = 0; index < this.dataPartySlik.length; index++) {
      // console.log("index", index);
      // if (this.dataPartySlik[index].partyId === element.partyId) {
      //   object = this.dataPartySlik;
      // }
      const predicate = {
        width: '80vw',
        data: { object: element, mode: this.mode, cif: this.partyCif !== undefined ? this.partyCif.customerNumber : this.partyCifDM },
      };
      if (element) {
        // if (!lodash.has(element.attributes, 'os')) {
        //   element.attributes['os'] = '';
        // }
        if (!lodash.has(element.attributes, 'name')) {
          element.attributes['name'] = '';
        }
        if (!lodash.has(element.attributes, 'relationship')) {
          element.attributes['relationship'] = '';
        }
        if (!lodash.has(element.attributes, 'facilityType')) {
          element.attributes['facilityType'] = '';
        }
        // if (!lodash.has(element.attributes, 'lastCollectablility')) {
        //   element.attributes['lastCollectablility'] = '';
        // }
        predicate.data['partySlik'] = element;
      }
      const dialogRef = this.dialog.open(DebtorDataSlikSummaryDebiturDialogComponent, predicate);
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.loading = true;
          // this.savePartySlik(res);
          // this.dataPartySlik = lodash.unionBy([res], this.dataPartySlik, 'id');
          this.dataPartySlik[index] = res;
          this.partyCif.sliks = this.dataPartySlik
          this.loading = false;
        }
      });
    // }
  }

  public openDialogUpload(): void {
    console.log("ini", this.partyCif);
    const predicate: object = {
      width: '80vw',
      data: {
        cif: this.partyCif !== undefined ? this.partyCif.customerNumber : this.partyCifDM,
      },
    };

    const dialogRef = this.dialog.open(DebtorDataSlikUploadComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {


      console.log("data awal", this.dataPartySlik);
      if (this.dataPartySlik.length > 0 && this.dataPartySlik.length <= 1) {
        if (this.dataPartySlik[0].id === undefined) {
          this.dataPartySlik = [];
        }
      }

      if (res) {

        for (let y = 0; y < res.body.length; y++) {
          const SlikBody = new PartySlik();
          SlikBody.attributes = {'name' : res.body[y].debtorName};
          SlikBody.partyId = this.partyCif ? this.partyCif.partyId : this.partyId;
          SlikBody.bank = res.body[y].bank
          SlikBody.limit = res.body[y].limit == null ? 0 : Number(res.body[y].limit.toString().replace(/\./g, ''));
          SlikBody.rate = res.body[y].rate == null ? 0 : Number(res.body[y].rate.toString().replace(' %', ''));
          SlikBody.tenor = res.body[y].tenor == null ? 0 : Number(res.body[y].tenor.toString().replace(' bulan', ''));
          SlikBody.outstanding = res.body[y].outstanding == null ? 0 : Number(res.body[y].outstanding.toString().replace(/\./g, ''));
          SlikBody.collateralIdrMio = res.body[y].collateralIdrMio == null ? 0 : Number(res.body[y].collateralIdrMio.toString().replace(/\./g, ''));
          SlikBody.restructureFrequency = res.body[y].restructureFrequency == null ? 0 : Number(res.body[y].frekuensiRestrukturasi);
          SlikBody.arrearsFrequency = res.body[y].arrearsFrequency == null ? 0 : Number(res.body[y].frekuensiTunggakan);
          SlikBody.arrearsBase = res.body[y].arrearsBase == null ? 0 : Number(res.body[y].tunggakanPokok);
          SlikBody.arrearsInterest = res.body[y].arrearsInterest == null ? 0 : Number(res.body[y].tunggakanBunga);
          SlikBody.arrearsReason = res.body[y].sebabMacet;
          SlikBody.lastCollectability = res.body[y].lastCollectability == null ? 0 : Number(res.body[y].kolTerakhir.substring(0,1));
          SlikBody.worstCollectability = res.body[y].worstCollectability == null ? 0 : Number(res.body[y].kolTerburuk.substring(0,1));
          SlikBody.collateralType = res.body[y].collateralType == null ? '' : res.body[y].collateralType;
          SlikBody.facilityType = 0;

          const findPeriod = this.bulan.find((obj) => obj.name === res.body[y].period.substring(3,6));
          SlikBody.period = findPeriod.id;

          this.dataPartySlik = lodash.concat(this.dataPartySlik,SlikBody);
          this.partyCif.sliks = this.dataPartySlik
        }

        if (this.partyCif) {
          this.partyCif.sliks = this.dataPartySlik;
        }

        this.partySlik = this.dataPartySlik;
        console.log("ini lo", this.partySlik);
        this.TransferService.setparam(this.partySlik);
      }


      console.log("datapartyslik", this.dataPartySlik);
      // bank: "BANK CIMB NIAGA BANK CIMB NIAGA KPO "
      // caraRestrukturasi:""
      // collateralIdrMio:null
      // collateralType:null
      // denda:"0"
      // facilityType:"Kartu Kredit atau Kartu Pembiayaan Syariah"
      // frekuensiRestrukturasi:"0"
      // frekuensiTunggakan:"0"
      // keterangan:""
      // kolTerakhir:"1 (0 hari)"
      // kolTerburuk:"1 (0 hari)"
      // limit:"20.000.000"
      // outstanding:"0"
      // period:"12 Oktober 2020"
      // rate:" 2 % "
      // sebabMacet:""
      // tanggalMacet:""
      // tanggalRestrukturasiAkhir:""
      // tenor:"48 bulan"
      // tunggakanBunga:"0"
      // tunggakanPokok:"0"
    });
  }

  public removeDebtorData(element, index):void {
    // this.dataPartySlik = lodash.pullAt(this.dataPartySlik,index);

    const newArray = _.remove(this.dataPartySlik, function(n) {
      return n === element;
    });

    this.dataPartySlik = _.concat([], this.dataPartySlik);

    if(this.partyCif) {
      this.partyCif.sliks = this.dataPartySlik;
    }

    this.partySlik = this.dataPartySlik;
    this.TransferService.removeValue(element);

    // const newArray = _.remove(this.dataPartySlik, function (n) {
    //   return _.indexOf(element, n) === index
    // });

    console.log("remove", newArray);
    console.log("hasil", this.dataPartySlik);
  }

  public savePartySlik(res: IPartySlik) {
    if (res.id) {
      this.partySlikService.update(res).subscribe((response: any) => {});
    } else {
      this.partySlikService.create(res).subscribe((response: any) => {});
    }
  }
}
