import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { FACILITY_TYPE } from '../../../../shared/constants/base.constants';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { DebtorDataSlikUploadComponent } from './debtor-data-silk-upload/debtor-data-slik-upload.component';
import { ActivatedRoute } from '@angular/router';
import { left } from '@popperjs/core';
import { toLower } from 'lodash';
import { PartySlikService } from 'app/entities/party-slik/party-slik.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'jhi-debtor-data-slik-summary-debitur-dialog',
  templateUrl: './debtor-data-slik-summary-debitur-dialog.component.html',
  styleUrls: ['../slik.css'],
})
export class DebtorDataSlikSummaryDebiturDialogComponent extends AbstractEntityMaterialComponent<IPartySlik> implements OnInit {
  public partySlik: IPartySlik;
  public partyCif: IPartyCif;
  public mode: any;
  public cif: string;
  public viewData: any;
  public selectedDataId: any;
  public facility_types: any = FACILITY_TYPE;
  public bulan: any = [
    { id: 1, name: 'Jan' },
    { id: 2, name: 'Feb' },
    { id: 3, name: 'Mar' },
    { id: 4, name: 'Apr' },
    { id: 5, name: 'Mei' },
    { id: 6, name: 'Jun' },
    { id: 7, name: 'Jul' },
    { id: 8, name: 'Agu' },
    { id: 9, name: 'Sep' },
    { id: 10, name: 'Okt' },
    { id: 11, name: 'Nov' },
    { id: 12, name: 'Des' },
  ];

  public displayColumns: string[] = [
    'no',
    'collateralType',
    'ownershipDocument',
    'collateralValue',
    'collateralValueNJOP',
    'collateralValueIndependentAppraisal',
    'banksAppraisalDate',
    'independentAppraisalDate',
  ];

  public collateralInfoList: any = [];
  public totalCollateralValue = 0;
  public totalNJOP = 0;
  public totalMarketValue = 0;
  public pageLength: String;

  id: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      selectedDataId: any;
      viewData: any;
      object: IPartyCif;
      partySlik: IPartySlik;
      mode: string;
      cif: string;
    },
    public partySlikService: PartySlikService,
    protected _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _dialog: MatDialogRef<DebtorDataSlikSummaryDebiturDialogComponent>,
    protected activatedRoute: ActivatedRoute
  ) {
    super(_snackBar, partySlikService);
    this.loading = false;
    this.itemsPerPage = 10;
    this.page = 0;
    this.selectedDataId = this.data.selectedDataId;
    this.viewData = this.data.viewData;
    this.partyCif = this.data.object;
    this.partySlik = this.data.partySlik;
    this.mode = this.data.mode;
    this.cif = this.data.cif;
  }
  ngOnInit(): void {
    this.parsingPartySlikCollaterals();
    this.paginatorLength = this.countPageLength(this.collateralInfoList);
    this.totalCollateralValue = this.countTotalCollateralValue(this.collateralInfoList);
    this.totalNJOP = this.countTotalNJOP(this.collateralInfoList);
    this.totalMarketValue = this.countTotlMarketValue(this.collateralInfoList);
  }

  public countPageLength(element: any): number {
    let totalCount: number;
    totalCount = 0;
    if (element) {
      for (let index = 0; index < element.length; index++) {
        totalCount = totalCount + 1;
        // console.log('this is the total count', totalCount);
      }
    }
    return totalCount;
  }

  protected postLoadDataLazy(): void {
    this.collateralInfoList;
  }

  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  inputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
  }

  public save(): void {
    this._dialog.close(this.partySlik);
  }

  public openDialog(): void {
    const predicate: object = {
      width: '80vw',
      data: {
        cif: this.data.cif,
      },
    };

    const dialogRef = this.dialog.open(DebtorDataSlikUploadComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.partySlik = res.body[0];
        this.partySlik.attributes = [];
        this.partySlik.limit = Number(this.partySlik.limit.toString().replace(/\./g, ''));
        this.partySlik.rate = Number(this.partySlik.rate.toString().replace(' %', ''));
        this.partySlik.tenor = Number(this.partySlik.tenor.toString().replace(' bulan', ''));
        this.partySlik.outstanding = Number(this.partySlik.outstanding);
        this.partySlik.collateralIdrMio = Number(this.partySlik.collateralIdrMio);
        this.partySlik.restructureFrequency = Number(res.body[0].frekuensiRestrukturasi);
        this.partySlik.arrearsFrequency = Number(res.body[0].frekuensiTunggakan);
        this.partySlik.arrearsBase = Number(res.body[0].tunggakanPokok);
        this.partySlik.arrearsInterest = Number(res.body[0].tunggakanBunga);
        this.partySlik.lastCollectability = Number(res.body[0].kolTerakhir.substring(0, 1));
        this.partySlik.worstCollectability = Number(res.body[0].kolTerburuk.substring(0, 1));
        this.partySlik.collateralType = this.partySlik.collateralType == null ? '' : this.partySlik.collateralType;
        this.partySlik.facilityType = this.partySlik.facilityType == null ? '' : this.partySlik.facilityType;
        this.partySlik.attributes = {};
        this.partySlik.period = this.partySlik.period == null ? '' : this.partySlik.period;

        // const findPeriod = this.bulan.find(obj => obj.name === res.body[0].period.substring(3, 6));
        // this.partySlik.period = findPeriod.id;
      }

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

  onNoClick(): void {
    this._dialog.close();
  }

  // Data Parsing
  public parsingPartySlikCollaterals(): void {
    // const listDetailPartySlik: any = [];
    for (let y = 0; y < this.viewData.length; y++) {
      if (this.viewData[y].id === this.selectedDataId) {
        if (this.viewData[y].attributes.partySlikCollaterals) {
          const item = this.viewData[y].attributes.partySlikCollaterals;
          this.collateralInfoList = [...JSON.parse(item)];
          // listDetailPartySlik = this.parsedPartyCollaterals(JSON.parse(item))
        }
      }
    }
    // console.log('this is the respnes collateralInfoList', this.collateralInfoList)
  }

  // Count Total Collateral Value
  public countTotalCollateralValue(element: any): number {
    let totalCollateralValue: number;
    totalCollateralValue = 0;
    if (element) {
      for (let i = 0; i < element.length; i++) {
        const regex = /[.,\s]/g;
        if (element[i].collateralIdrMio) {
          totalCollateralValue = totalCollateralValue + Number(element[i].collateralIdrMio.replace(regex, ''));
        }
      }
    }
    // console.log('datanya yang di ambil', element);
    // console.log('Hasil Hitungan', totalCollateralValue);
    return totalCollateralValue;
  }

  // Count Total NJOP
  public countTotalNJOP(element: any): number {
    let totalNJOP: number;
    totalNJOP = 0;
    if (element) {
      for (let i = 0; i < element.length; i++) {
        const regex = /[.,\s]/g;
        if (element[i].nilaiNJOP) {
          totalNJOP = totalNJOP + Number(element[i].nilaiNJOP.replace(regex, ''));
        }
      }
    }
    // console.log('datanya yang di ambil', element);
    // console.log('Hasil Hitungan', totalNJOP);
    return totalNJOP;
  }

  // Count Total Market Value
  public countTotlMarketValue(element: any): number {
    let totalMarketValue: number;
    totalMarketValue = 0;
    if (element) {
      for (let i = 0; i < element.length; i++) {
        const regex = /[.,\s]/g;
        if (element[i].nilaiPenilai) {
          totalMarketValue = totalMarketValue + Number(element[i].nilaiPenilai.replace(regex, ''));
        }
      }
    }
    // console.log('datanya yang di ambil', element);
    // console.log('Hasil Hitungan', totalMarketValue);
    return totalMarketValue;
  }
}
